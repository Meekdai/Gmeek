/* GmeekSEO —— 文章页/固定页 head 元数据运行时补全
 * 1) canonical 绝对 URL（复用框架已生成的 og:url，不自己拼域名）
 * 2) 清洁 meta/og/twitter description（渲染后 #postBody.textContent，天然剥离 markdown 语法）
 * 3) twitter:card 全套（summary_large_image；缺失时各社交平台本会回退读 OG）
 * 4) 文章页 BlogPosting JSON-LD（日期/标签/作者/发布者，数据取自 /postList.json）
 *
 * 作用域：config 的 script 字段只注入文章页与固定页底部，首页/列表页不会加载本插件；
 *         正则再兜底：只在 /post/N.html 与固定页（about.html/archive.html 等，
 *         取路径末段判断，兼容 project pages 子路径部署）生效。
 *         JSON-LD 仅普通文章生成；固定页只有 canonical + 摘要 + twitter。
 *
 * 已知边界：canonical/JSON-LD 等是运行时注入，静态 HTML 源码（curl）里看不到，
 *           依赖爬虫的渲染队列（Google/Bing 支持渲染；不渲染 JS 的爬虫读不到，
 *           但框架构建期生成的静态 OG 标签不受影响，分享卡片仍可正常显示）。
 */
(function () {
    'use strict';
    if (window.__gmeekSEO) return;
    window.__gmeekSEO = true;

    var pathname = location.pathname;
    var postMatch = pathname.match(/\/post\/(\d+)\.html$/);
    // 取末段文件名判断，兼容用户站（/about.html）与 project pages（/repo/about.html）
    var baseName = pathname.split('/').pop();
    var isFixedPage = /^[A-Za-z0-9_-]+\.html$/.test(baseName);
    if (!postMatch && !isFixedPage) return;
    if (!document.getElementById('postBody')) return; // 没有正文容器，不碰 head

    var DESC_LIMIT = 140;
    var SENTENCE_MARKS = ['。', '！', '？', '.', '!', '?', '；', ';', '，', ','];

    function $(sel) { return document.querySelector(sel); }

    function ogContent(prop) {
        var m = $('meta[property="og:' + prop + '"]');
        return m ? m.getAttribute('content') : '';
    }

    function ensureMeta(selector, attr, key, content) {
        var m = $(selector);
        if (!m) {
            m = document.createElement('meta');
            m.setAttribute(attr, key);
            document.head.appendChild(m);
        }
        m.setAttribute('content', content);
        return m;
    }

    // 1) canonical：直接复用 og:url（框架构建期生成，绝对地址、无 query/hash）
    var canonicalUrl = ogContent('url') || (location.origin + pathname);
    if (!$('link[rel="canonical"]')) {
        var link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonicalUrl);
        document.head.appendChild(link);
    }

    // 2) 清洁摘要：克隆正文，剔除标题/代码块/插件 UI，textContent 归一化后按句读截断
    function buildDescription() {
        var body = document.getElementById('postBody');
        if (!body) return '';
        var clone = body.cloneNode(true);
        var junk = clone.querySelectorAll(
            'h1,h2,h3,h4,h5,h6,pre,script,style,nav,.gmeek-pn,#archiveTimeline,.toc');
        for (var i = 0; i < junk.length; i++) {
            junk[i].parentNode.removeChild(junk[i]);
        }
        var text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text || text.length <= DESC_LIMIT) return text;
        var head = text.slice(0, DESC_LIMIT);
        var cut = -1;
        for (var k = 0; k < SENTENCE_MARKS.length; k++) {
            var p = head.lastIndexOf(SENTENCE_MARKS[k]);
            if (p > cut) cut = p;
        }
        // 至少留 70 字才在句读处收，避免一个短引子后面跟着硬切
        if (cut >= 70) return head.slice(0, cut + 1).trim();
        return head.trim() + '…';
    }

    // 3) 同步补全（不依赖网络）
    var title = ogContent('title') || document.title;
    var image = ogContent('image');
    // archive 这类正文只有挂载点的固定页：清洁结果为空 → 用干净标题，绝不用框架的脏原文
    var desc = buildDescription() || ogContent('title') || ogContent('description');

    if (desc) {
        ensureMeta('meta[name="description"]', 'name', 'description', desc);
        ensureMeta('meta[property="og:description"]', 'property', 'og:description', desc);
        ensureMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
    }
    ensureMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    ensureMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    if (image) ensureMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // 4) 文章页 JSON-LD（异步取 postList，不阻塞上面的同步部分）
    if (postMatch) {
        fetch('/postList.json', { cache: 'no-cache' })
            .then(function (r) {
                if (!r.ok) throw new Error('postList HTTP ' + r.status);
                return r.json();
            })
            .then(function (list) {
                var item = list['P' + postMatch[1]];
                if (!item || !item.postUrl) return;
                if ($('script[type="application/ld+json"]')) return;

                var footerLink = $('#footer a');
                var siteName = footerLink ? footerLink.textContent.trim() : location.hostname;
                var authorName = siteName.replace(/的博客$/, '');

                var ld = {
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    headline: String(item.postTitle).slice(0, 110),
                    description: desc,
                    image: image || undefined, // 未配置 ogImage 时省略，避免输出空字符串被富结果测试判错
                    datePublished: item.createdDate,
                    keywords: Array.isArray(item.labels) ? item.labels.join(', ') : '',
                    author: { '@type': 'Person', name: authorName },
                    publisher: {
                        '@type': 'Organization',
                        name: siteName,
                        logo: image ? { '@type': 'ImageObject', url: image } : undefined
                    },
                    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
                    url: canonicalUrl
                };

                var s = document.createElement('script');
                s.setAttribute('type', 'application/ld+json');
                s.textContent = JSON.stringify(ld);
                document.head.appendChild(s);
            })
            .catch(function (e) { console.warn('GmeekSEO:', e && e.message); });
    }
})();
