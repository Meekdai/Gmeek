function createBSZ() {
    var postBody = document.getElementById('postBody');
    if (postBody){
        postBody.insertAdjacentHTML('afterend','<div id="busuanzi_container_page_pv" style="display:none;float:left;margin-top:8px;font-size:small;">本文浏览量<span id="busuanzi_value_page_pv"></span>次</div>');
    }
    var runday = document.getElementById('runday');
    runday.insertAdjacentHTML('afterend', '<div id="busuanzi_container_site_pv" style="display:none;">总浏览量<span id="busuanzi_value_site_pv"></span>次 • </div>');
}

document.addEventListener("DOMContentLoaded", function() {
    createBSZ();
    var element = document.createElement('script');
    element.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    document.head.appendChild(element);
    console.log("\n %c GmeekBSZ Plugins https://github.com/Meekdai/Gmeek \n","padding:5px 0;background:#bc4c00;color:#fff");
});
