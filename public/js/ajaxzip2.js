/**
 * AjaxZip2 - Japanese Zip Code Auto-Fill
 * 郵便番号から住所を自動入力するライブラリ
 */

var AjaxZip2 = AjaxZip2 || {};

AjaxZip2.JSONDATA = "js/ajaxzip2-data";
AjaxZip2.timeout = null;

AjaxZip2.zip2addr = function(zip1, zip2, addr1, addr2, pref, prefid) {
    var zip1El = document.getElementById(zip1);
    var zip2El = document.getElementById(zip2);
    
    if (!zip1El || !zip2El) return;
    
    var zip = zip1El.value + zip2El.value;
    zip = zip.replace(/[^0-9]/g, '');
    
    if (zip.length !== 7) return;
    
    // Simulate zip code lookup (in real implementation, this would use a JSON database)
    var zipData = {};
    var addr = zipData[zip];
    
    if (addr) {
        if (prefid) {
            var prefEl = document.getElementById(prefid);
            if (prefEl) {
                prefEl.value = addr[0] || '';
            }
        }
        if (addr1) {
            var addr1El = document.getElementById(addr1);
            if (addr1El) {
                addr1El.value = (addr[1] || '') + (addr[2] || '');
            }
        }
        if (addr2) {
            var addr2El = document.getElementById(addr2);
            if (addr2El) {
                addr2El.value = addr[3] || '';
            }
        }
    }
};

AjaxZip2.onZipKeyUp = function(e) {
    var target = e.target || e.srcElement;
    var maxLength = target.maxLength || 3;
    
    if (target.value.length >= maxLength) {
        var next = target.getAttribute('data-next');
        if (next) {
            var nextEl = document.getElementById(next);
            if (nextEl) {
                nextEl.focus();
            }
        }
    }
};

// Auto-initialize
if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(function($) {
        $('input[data-ajaxzip2]').on('keyup', AjaxZip2.onZipKeyUp);
    });
}
