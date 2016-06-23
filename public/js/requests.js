"use strict"

const request = (function (){
   function get(url){
      return new Promise(function (resolve, reject){
         function reqListener(){
            if (this.readyState !== 4){
               return;
            }
            if (this.status !== 200){
               reject(this.status);
               return;
            }

            resolve(this.responseText);
         };

         var oReq = new XMLHttpRequest();
         oReq.addEventListener("load", reqListener);
         oReq.open("GET", url);
         oReq.send(null);
      });
   }

   return {
      get: get
   };
}());
