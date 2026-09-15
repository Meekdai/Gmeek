/* GmeekExternal —— 正文外链自动在新标签页打开
 * 作用域：#postBody 内的 <a>（config 的 script 字段只注入文章页/固定页）
 * 外链判定：交给 URL 构造器按 host 比较——绝对/协议相对/各种相对路径
 *           都能正确归类，自己站点的绝对 URL 不会误判
 * 安全：target=_blank 时补 rel=noopener（合并已有值，不覆盖）
 * 不做：不自动加 nofollow（SEO 语义）、不强制 noreferrer（保留来源统计）
 */
(function () {
    var body = document.getElementById('postBody');
    if (!body) return;

    var links = body.querySelectorAll('a[href]');
    Array.prototype.forEach.call(links, function (a) {
        var u = toUrl(a.getAttribute('href'));
        if (!u) return;                 // 锚点/mailto/tel/javascript/非法值
        if (u.hostname === location.hostname) return; // 站内链接原地跳

        // 尊重作者显式声明（比如手写 target="_self"）
        if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
        mergeRel(a, 'noopener');
    });

    function toUrl(href) {
        if (!href) return null;
        href = href.trim();
        if (!href || href.charAt(0) === '#') return null;
        if (/^(mailto|tel|javascript):/i.test(href)) return null;
        try {
            return new URL(href, location.href);
        } catch (e) {
            return null;
        }
    }

    function mergeRel(a, token) {
        var rels = (a.getAttribute('rel') || '').split(/[ \t]+/).filter(Boolean);
        if (rels.indexOf(token) === -1) {
            rels.push(token);
            a.setAttribute('rel', rels.join(' '));
        }
    }
})();
