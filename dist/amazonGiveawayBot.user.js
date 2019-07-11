// ==UserScript==
// @name amazon-giveaway-bot
// @version 3.0.0
// @author Ty Gooch <gooch.ty@gmail.com>
// @description Automates Amazon giveaway entries
// @homepage https://github.com/TyGooch/amazon-giveaway-bot#readme
// @supportURL https://github.com/TyGooch/amazon-giveaway-bot/issues
// @match https://www.amazon.com/giveaway/*
// @updateURL https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_notification
// @grant unsafeWindow
// @grant window.focus
// @run-at document-start
// @noframes
// ==/UserScript==

!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);function o(){GM_getValue(document.querySelector("#amazonEmail").value+"shippingAddress")&&Object.entries(JSON.parse(GM_getValue(document.querySelector("#amazonEmail").value+"shippingAddress"))).forEach(e=>{document.querySelector("#"+e[0]).value=e[1]})}function i(){let e={};document.querySelectorAll("#addressForm input").forEach(t=>{e[t.id]=t.value}),GM_setValue(document.querySelector("#amazonEmail").value+"shippingAddress",JSON.stringify(e))}function l(){if(GM_getValue("running"))if(giveaways&&giveaways.length>0){!function(e){if(!GM_getValue("running"))return;if(log("Loading","link",e),!botFrame.contentWindow.P.pageContext)return void(botFrame.contentWindow.location="https://www.amazon.com/ga/giveaways");csrfToken=botFrame.contentWindow.P.pageContext.csrfToken;let t=e.split("/p/")[1].split("?")[0];fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${t}/participation`,{credentials:"include",headers:{accept:"application/json, text/plain, */*","accept-language":"en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7","content-type":"application/json;charset=UTF-8","x-amzn-csrf":csrfToken},referrer:e,referrerPolicy:"no-referrer-when-downgrade",body:null,method:"GET",mode:"cors"}).then(e=>e.json()).then(n=>{if(console.log(n.success.status),"notParticipated"!==n.success.status)return r(t),log("Giveaway "+n.success.status),void l();if(n.success.nextUserAction){let o="followAuthor"===n.success.nextUserAction.name;fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${t}/participation/nextAction`,{credentials:"include",headers:{accept:"application/json, text/plain, */*","accept-language":"en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7","content-type":"application/json;charset=UTF-8","x-amzn-csrf":csrfToken},referrer:e,referrerPolicy:"no-referrer-when-downgrade",body:JSON.stringify({submission:{name:n.success.nextUserAction.name}}),method:"PUT",mode:"cors"}).then(e=>e.json()).then(e=>{a(t,`{"encryptedState":"${e.success.encryptedState}"}`,o)})}else a(t)}).catch(e=>{log(e),r(t),l()})}(giveaways.pop())}else log("Searching Giveaways..."),function e(){let t=[];fetch("https://www.amazon.com/gax/-/lex/api/v1/giveaways?offset="+24*offset,{credentials:"include",referrer:botFrame.contentWindow.location.href,referrerPolicy:"no-referrer-when-downgrade",body:null,method:"GET",mode:"cors"}).then(e=>e.json()).then(n=>{if(!GM_getValue("running"))return;offset+=1,document.querySelector("#logContent").lastElementChild.textContent.includes("Searching Giveaways")?document.querySelector("#logContent").lastElementChild.lastElementChild.textContent="Searching Giveaways... (page "+offset+"/"+Math.ceil(parseFloat(n.totalGiveaways/24))+")":log("Searching Giveaways... (page "+offset+"/"+Math.ceil(parseFloat(n.totalGiveaways/24))+")"),historyKey=document.querySelector("#amazonEmail").value+"history";let o=GM_getValue(historyKey);n.giveaways.forEach(e=>{let n=!o||!o.includes(e.id);e.title.includes("Kindle Edition")&&GM_getValue("disableKindle")&&(n=!1),e.participationRequirement&&e.participationRequirement.includes("FOLLOW")&&GM_getValue("disableFollow")&&(n=!1),n&&t.push("https://www.amazon.com/ga/p/"+e.id)}),t.length>0?(giveaways=t,l()):24*offset<n.totalGiveaways?e():(new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3").play(),log("All available giveaways have been entered for this account. Switch accounts or come back later to enter more.","error"),GM_notification("All available giveaways have been entered for this account. Switch accounts or come back later to enter more.","Giveaway Bot Stopped"),document.querySelector("#stop").click())})}()}function a(e,t="{}",n=!1){GM_getValue("running")&&(log("Submitting entry... "),fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${e}/participation`,{credentials:"include",headers:{accept:"application/json, text/plain, */*","accept-language":"en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7","content-type":"application/json;charset=UTF-8","x-amzn-csrf":csrfToken},referrer:`https://www.amazon.com/ga/p/${e}`,referrerPolicy:"no-referrer-when-downgrade",body:t,method:"POST",mode:"cors"}).then(e=>e.json()).then(t=>{console.log(t.success.status),document.querySelector("#logContent").lastElementChild.lastElementChild.textContent="Giveaway "+t.success.status;let o=GM_getValue("logHistory").split("|");o[o.length-1]=o[o.length-1].replace("Submitting entry...","Giveaway "+t.success.status),GM_setValue("logHistory",o.join("|")),function(){let e=GM_getValue("lifetimeEntries");GM_setValue("lifetimeEntries",e+1);let t=GM_getValue("currentSessionEntries");GM_setValue("currentSessionEntries",t+1),function(){if(!GM_getValue("running"))return;GM_getValue("currentSessionEntries")>0&&(document.querySelector("#currentSessionEntries").textContent="("+GM_getValue("currentSessionEntries")+" this run)");GM_getValue("currentSessionWins")>0&&(document.querySelector("#currentSessionWins").textContent="("+GM_getValue("currentSessionWins")+" this run)");document.querySelector("#lifetimeEntriesValue").textContent=GM_getValue("lifetimeEntries"),document.querySelector("#totalWinsValue").textContent=GM_getValue("totalWins")}()}(),"lucky"!==t.success.status?(r(e),n?unfollowAuthors():l()):botFrame.contentWindow.location.href="https://www.amazon.com/ga/p/"+e}).catch(e=>{console.log("ERROR"),log(e),l()}))}function r(e){let t=document.querySelector("#amazonEmail").value+"history",n=GM_getValue(t,"");(n+="|"+e).length>68e3&&(n=n.slice(n.length-68e3)),GM_setValue(t,n)}let s,c;n.d(t,"main",function(){return p});let d=[],u=0;function p(){if(!GM_getValue("running"))return;let e=c.contentWindow.location.href;e.includes("/ap/signin")||c.contentDocument.querySelector(".cvf-account-switcher")||e.includes("/ap/cvf")?doSignIn():GM_getValue("currentAccount")&&GM_getValue("currentAccount").includes(document.querySelector("#amazonEmail").value)?e.includes("/home")?(d(GM_getValue("currentAccount")+" signed in"),c.contentWindow.location.href="https://www.amazon.com/ga/giveaways"):e.includes("/ga/giveaways")?l():e.includes("/ga/won")&&claimWin(e.split("/won/")[1].split("#")[0]):(u=0,c.contentDocument.querySelector("#nav-item-switch-account").click())}window.addEventListener("load",()=>{document.title="Amazon Giveaway Bot",GM_setValue("running",!1);let e=document.createElement("div");e.innerHTML='\n<style>\n  input:not([type=\'checkbox\']) {\n    width: 250px;\n    box-shadow: 0 0 0 100px #fff inset !important;\n    border: 1px solid rgb(206, 212, 218) !important;\n  }\n\n  .botNavLink {\n    /* all: unset; */\n    background-color: transparent;\n    text-decoration: none !important;\n    /* border-bottom: none; */\n    /* border-left: 1px solid transparent; */\n    /* border-right: 1px solid transparent;\n    border-top: 1px solid transparent; */\n    border-bottom: 1px solid #ccc;\n    padding: 10px;\n    font-size: 1rem;\n    outline: 0 !important;\n    flex: 1;\n    text-align: center;\n    color: #777;\n    /* box-shadow: 0 -1px 0 #ccc inset; */\n  }\n\n  .botNavLink:first-child {\n    /* border-radius: .28571429rem 0 0 0; */\n  }\n\n  .botNavLink.active {\n    position: relative;\n    /* top: 1px; */\n    color: #111;\n    /* box-shadow: 0 -1px 0 #F58B1F inset; */\n    background-color: #fff;\n    font-weight: 500;\n    /* border-top-width: 1px; */\n    border: 1px solid #ccc;\n    /* border-color: #ccc; */\n    /* margin-bottom: -1px; */\n    border-bottom: 1px solid transparent;\n    /* box-shadow: none; */\n    border-radius: .28571429rem .28571429rem 0 0 !important;\n  }\n\n  .botPanel {\n    position: relative;\n    background-color: transparent;\n    width: 100%;\n    display: none;\n    flex-direction: column;\n    padding: 7px 16px;\n    height: 400px;\n    width: 600px;\n    text-align: left;\n    overflow-y: scroll;\n    overflow-x: hidden;\n    border: 1px solid #ccc;\n    border-top: 0;\n  }\n\n  .botPanel.active {\n    display: block;\n  }\n\n</style>\n\n<div id="controlPanel" style="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; background:#000; z-index: 9999;">\n  <div id="container" style="font-family: \'Helvetica Neue\', Arial, sans-serif; overflow: hidden; position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 0px solid transparent; border-radius: .28571429rem; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: space-between;">\n    <div style="position: relative; border-bottom: 0px solid #ddd; margin-top: 0; text-align: center;">\n      <img style="width: 600px;" src="https://svgshare.com/i/Dwc.svg" />\n    </div>\n\n    <div style="display: flex; background-color: transparent; margin-bottom: 0px; background: #fff; z-index: 1;">\n      <a target="#botOptions" id="showOptions" class="botNavLink active">\n        Settings\n      </a>\n      <a target="#log" id="showLog" class="botNavLink">\n        Activity Log\n      </a>\n      <a target="#botFrameContainer" id="showBotFrame" class="botNavLink">\n        Browser\n      </a>\n      <a target="#winningsList" id="showWinnings" class="botNavLink">\n        Winnings\n      </a>\n      \x3c!-- <span class="botNavLink" style="flex: 1;"></span> --\x3e\n      \x3c!-- <div style="flex: 1; display:flex; flex-direction: column; justify-content: space-between; padding: 10px; border-top: 0px solid #ccc; border-bottom: 1px solid #ccc; background: #fff;">\n      </div> --\x3e\n    </div>\n\n    <div id="botOptions" class="botPanel active">\n      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">\n        Amazon Account\n      </div>\n      <div style="display: flex; padding-bottom:10px;">\n        <div style="display: flex; flex-direction: column;">\n          <div style="padding-bottom: 10px;"><label for="amazonEmail">Email</label><input id="amazonEmail" name="amazonEmail" type="text" placeholdertype="Amazon Email" class="required" /></div>\n        </div>\n        <div style="padding-left: 10px;"><label for="amazonPassword">Passsword</label><input id="amazonPassword" name="amazonPassword" type="password" placeholdertype="Amazon Password" class="required" /></div>\n      </div>\n      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Captcha Solving</div>\n      <div style="padding-bottom: 20px;"><label for="twoCaptchaKey">2Captcha Key <a style="font-weight: 400;" href="https://2captcha.com?from=7493321">(referral link)</a></label><input id="twoCaptchaKey" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here" /></div>\n      <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Giveaway Filter</div>\n      <div style="display: flex; padding-bottom:10px;">\n        <div style="display: flex; flex-direction: column;">\n          <div style="padding-bottom: 10px;">\n            <div><input id="disableFollow" name="disableFollow" type="checkbox" /><span> Requires Follow</span></div>\n            <div><input id="disableKindle" name="disableKindle" type="checkbox" /><span> Kindle Books</span></div>\n          </div>\n        </div>\n      </div>\n      <div style="font-size: 17px; font-weight: 700; border-bottom: 1px solid #eee;">Shipping Address</div>\n      <div id="addressForm" style="display: flex; flex-direction: column;">\n        <div style="padding: 10px 0px;"><label for="fullName">Full Name</label><input id="fullName" name="fullName" type="text" class="required" /></div>\n        <div style="padding-bottom: 10px;"><label for="street1">Street Address</label><input id="street1" name="street1" type="text" class="required" placeholder="Street and number, P.O. box, c/o." /></div>\n        <div style="padding-bottom: 10px;"><input id="street2" name="street2" type="text" placeholder="Apartment, suite, unit, building, floor, etc." /></div>\n        <div style="padding-bottom: 10px;"><label for="city">City</label><input id="city" name="city" type="text" class="required" /></div>\n        <div style="padding-bottom: 10px;"><label for="state">State / Province / Region</label><input id="state" name="state" type="text" class="required" /></div>\n        <div style="padding-bottom: 10px;"><label for="zip">Zip Code</label><input id="zip" name="zip" type="text" class="required" /></div>\n        <div style="padding-bottom: 10px;"><label for="phone">Phone number</label><input id="phone" name="phone" type="text" class="required" /></div>\n      </div>\n    </div>\n\n    <div id="log" class="botPanel" style="padding: 0px;">\n      <div id="logContent" style="display: flex; flex-direction: column; padding: 0px 16px; text-align: left; overflow: scroll; height: 399px; max-height: 399px;"></div>\n      <button id="clearLog" style="display: none; position: absolute; bottom: 5px; right: 10px; width: 50px;">Clear</button>\n      <a><svg id="autoscroll" style="display: none; position: absolute; bottom: 5px; left: calc(50% - 25px);" class="a" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><defs><style>.cls-1{fill:#2196f3;}.cls-2{fill:#fff;}</style></defs><title>Untitled-1</title><circle class="cls-1" cx="12.5" cy="12.5" r="12.5"/><path class="cls-2" d="M20.5,12.5l-1.4-1.41-5.6,5.58V4.5h-2V16.67L5.93,11.08,4.5,12.5l8,8Z" transform="translate(0 0)"/></svg></a>\n    </div>\n\n    <div id="botFrameContainer" class="botPanel" style="padding: 0px;">\n      <iframe id="botFrame" style="width: 1200px; height: 800px; transform: scale(0.5); transform-origin: top left; border: 0;" src="https://www.amazon.com/ga/giveaways"></iframe>\n    </div>\n\n    <div id="winningsList" class="botPanel" style="padding: 0px;">\n\n    </div>\n\n    <div style=" border-top: 0px solid #ddd; background-color: #fff; display: flex; justify-content: space-between; padding: 10px 16px; text-align: left;">\n      <div style=" display:flex; flex-direction: column;">\n        <span style="display: flex;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="margin: 0px 5px;" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"></span></span>\n        <span style="display: flex;" id="totalWins"><b>Giveaways Won: </b><span style="margin: 0px 5px;" id="totalWinsValue"></span><span id="currentSessionWins"></span></span>\n      </div>\n      <button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n      <button id="stop" style="display: none; background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n    </div>\n  </div>\n</div>\n',document.body.appendChild(e),document.querySelector("#disableFollow").checked=GM_getValue("disableFollow"),document.querySelector("#disableKindle").checked=GM_getValue("disableKindle"),document.querySelector("#lifetimeEntriesValue").innerHTML=GM_getValue("lifetimeEntries",0),document.querySelector("#totalWinsValue").innerHTML=GM_getValue("totalWins",0),document.querySelector("#amazonEmail").value=GM_getValue("currentAccount",""),GM_getValue("twoCaptchaKey")&&(document.querySelector("#twoCaptchaKey").value=GM_getValue("twoCaptchaKey")),o(),document.querySelectorAll(".botNavLink").forEach(e=>{e.onclick=function(e){e.preventDefault(),document.querySelector(".botNavLink.active").classList.remove("active"),document.querySelector(".botPanel.active").classList.remove("active"),this.classList.add("active"),document.querySelector(this.target).classList.add("active")}}),document.querySelector("#showLog").addEventListener("click",()=>{0===document.querySelector("#logContent").childElementCount&&function(){let e=GM_getValue("logHistory");""!==e&&(document.querySelector("#clearLog").style.display="flex",e.split("|").forEach(e=>{let t=document.createElement("div");t.innerHTML=e,document.querySelector("#logContent").appendChild(t.firstChild)}),document.querySelectorAll("#logContent a").forEach(e=>{e.onclick=t=>{t.preventDefault(),document.querySelector("#botFrame").contentWindow.location.href=e.href,document.querySelector("#showBotFrame").click()}}),document.querySelector("#logContent").lastElementChild.scrollIntoView())}()}),document.querySelector("#clearLog").onclick=function(){GM_setValue("logHistory",""),document.querySelector("#logContent").innerHTML="",document.querySelector("#autoscroll").style.display="none",document.querySelector("#clearLog").style.display="none"},document.querySelector("#logContent").onscroll=function(e){""!==document.querySelector("#logContent").innerHTML&&(this.oldScroll>this.scrollTop?(s=!1,document.querySelector("#autoscroll").style.display="block"):this.scrollHeight-this.clientHeight===this.scrollTop&&document.querySelector("#autoscroll").onclick(),this.oldScroll=this.scrollTop)},document.querySelector("#autoscroll").onclick=function(){document.querySelector("#autoscroll").style.display="none",document.querySelector("#logContent").lastElementChild.scrollIntoView(),s=!0},document.querySelector("#disableFollow").onclick=function(){GM_setValue("disableFollow",document.querySelector("#disableFollow").checked)},document.querySelector("#disableKindle").onclick=function(){GM_setValue("disableKindle",document.querySelector("#disableKindle").checked)},document.querySelector("#amazonEmail").oninput=function(){o()},document.querySelectorAll("#addressForm input").forEach(e=>{e.oninput=i}),document.querySelector("#run").onclick=function(){let e=[];document.querySelectorAll(".required").forEach(t=>{""===t.value&&e.push(t.labels[0].textContent)}),e.length>0?alert("Missing required values for:\n"+e.join("\n")+"\n\nPlease provide them before starting bot."):(GM_setValue("running",!0),GM_setValue("currentSessionEntries",0),GM_setValue("currentSessionWins",0),GM_setValue("twoCaptchaKey",document.querySelector("#twoCaptchaKey").value),document.querySelector("#run").style.display="none",document.querySelector("#stop").style.display="block",s=!0,document.querySelector("#showLog").click(),d("Bot Started for "+document.querySelector("#amazonEmail").value),(c=document.querySelector("#botFrame")).onload=p,p(),window.addEventListener("unload",()=>{GM_getValue("running")&&d("Bot stopped"),GM_setValue("running",!1)},!1))},document.querySelector("#stop").onclick=function(){d("Bot stopped"),GM_setValue("running",!1),c.removeEventListener("load",p),document.querySelector("#currentSessionEntries").textContent="",document.querySelector("#currentSessionWins").textContent="",document.querySelector("#stop").style.display="none",document.querySelector("#run").style.display="block"}},{capture:!1,once:!0})}]);