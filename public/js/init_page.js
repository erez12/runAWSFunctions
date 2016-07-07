"use strict"

function createEditor(name){
   let editor = ace.edit(name);
   editor.setTheme("ace/theme/monokai");
   editor.getSession().setMode("ace/mode/javascript");
   editor.setFontSize(14);

   return editor;
}

let getNewUrl = functionName => location.origin + "?lastAction=" + functionName;

let EditPopupOpenObserver = $.Callbacks();
EditPopupOpenObserver.topics = {
   POPUP_OPEN: "open",
   POPUP_CLOSE: "close"
}
let getFunctionCode = (functionName) => request.get("functions/" + functionName + ".js");

function popupAlert(msg){
   $.alert(msg, {
      autoClose: true,
      closeTime: 2000,
      // danger, success, warning or info
      type: 'success',
      // position+offeset
      // top-left,top-right,bottom-left,bottom-right,center
      position: ['center', [-0.42, 0]],
      speed: 'normal',
      isOnly: false,
      // Minimal space in PX from top
      minTop: 10
   });
}
// =================
// First Tab

// Update Test Action - regions, actions
;(function (){
    const appendOptions = (listOfOptions, $elem) => listOfOptions.forEach( option => $("<option value=" + option + ">" + option + "</option>").appendTo($elem) );
    const setActiveAction = () => $("#actions").val(window.location.search.split('=')[1]);
    $.when($.getJSON('regions'), $.getJSON('actions'))
        .then((regions, actions) => {
            appendOptions(regions[0], $('#regions'));
            appendOptions(actions[0], $('#actions'));
            setActiveAction()
        });
}());

// Action Editor Code Change Handler
;(function (){
   function getParamsTemplateFromCode(code){
      try {
         return YAML.parse(/\*(.|[\r\n])*?\*/.exec(code)[0].replace(/\*/g,'')).params || {}
      } catch(e) {
         return {};
      }
   }
   function updateEditorCode(counter){
      counter = counter || 0;
      let selectedFunction = $("#actions option:selected")[0];

      if (!selectedFunction || !selectedFunction.value){
         if (counter > 5 ){
            return;
         }

         counter++;
         setTimeout(updateEditorCode, 1000, counter);
         return;
      }

      getFunctionCode(selectedFunction.value).then((code) => {
         createEditor("action-editor").getSession().setValue(code);
         createEditor("params-editor").getSession().setValue(JSON.stringify(getParamsTemplateFromCode(code), null, '\t'));
      });

   }

   var actionEditor = createEditor("action-editor");
   $("#actions").change(function() {
      updateEditorCode();
   });

   updateEditorCode();
}());

// Action Editor ctrl + s handler
;(function (){
   let isPopupOpen = false;

   EditPopupOpenObserver.add((topic) => {
      if (topic == EditPopupOpenObserver.topics.POPUP_OPEN) {
         isPopupOpen = true;
      }

   });

   $(window).bind('keydown', function(event) {
      let isTestTab = $("#test").hasClass('active');
      // TODO - add support for edit tab
      if (!isTestTab || isPopupOpen || !(event.ctrlKey || event.metaKey) || String.fromCharCode(event.which).toLowerCase() !== 's'){
         return;
      }

      event.preventDefault();
      let oldFunctionName = $("#actions option:selected")[0].value;
      let newFunctionName = oldFunctionName;
      let functionBody = createEditor("action-editor").getSession().getValue();

      $.post('edit', {
         oldFunctionName: oldFunctionName,
         newFunctionName: newFunctionName,
         newFunctionBody: functionBody
      }).done(() => { popupAlert('  Saved...  ') });
   });
}());

// Edit Functions Editor Handler
;(function (){
   $('#myModal').on('show.bs.modal', function (e) {
      $("#edit-function_name").val($("#actions option:selected")[0].value);
      createEditor("edit-function-editor").getSession().setValue(createEditor("action-editor").getSession().getValue());
   });
}());

// Edit Submit
;(function (){
   $('#edit_submit').on('click', function (){
      EditPopupOpenObserver.fire(EditPopupOpenObserver.topics.POPUP_OPEN);
      let oldFunctionName = $("#actions option:selected")[0].value;
      let newFunctionName = $("#edit-function_name").val();
      let functionBody = createEditor("edit-function-editor").getSession().getValue();

      swal({
          title: "Edit Action",
          text: "Are you sure you want to update the action ?" + (oldFunctionName == newFunctionName ? "" : "\n(Note that old function will be removed)"),
          type: "info",
          showCancelButton: true,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
      }, function(){
          $.post('edit', {
             oldFunctionName: oldFunctionName,
             newFunctionName: newFunctionName,
             newFunctionBody: functionBody
          }).done(function(data) {
             swal("Updated!", "Your action has been updated.", "success");
             setTimeout( () => { window.location = getNewUrl(newFunctionName); }, 1000);
          });
       });
       // TODO - need to catch cancel event to set popup close
      return;
   });
}());

// Test submit;
;(function (){
    $("#test_submit").click(function(event) {
        event.preventDefault();

        let selectedRegion = $("#regions").val();
        let selectedAction = $("#actions").val();
        let requestParams = JSON.parse(createEditor("params-editor").getSession().getValue() || "{}");

        // TODO - add get file content of input from text area

        $.post('run', {
            region: selectedRegion,
            action: selectedAction,
            params: requestParams
        }).done(function(data) {
            createEditor("result-editor").getSession().setValue(typeof data.result == "string" ? data.result : JSON.stringify(data.result, null, '\t'));
            $('#resultModal').modal('show')
        });
    });
}());

// =================
// Second Tab

// Create New Functions Editor
;(function (){
   getFunctionCode("base_code")
      .then(function (data){
         var functionEditor = createEditor("create-function-editor");
         functionEditor.getSession().setValue(data);
   });
}());

// Create Submit
;(function (){
    $("#create_submit").click(function(event) {
        let functionName = $("#function_name").val();
        let editor = createEditor("create-function-editor");
        let functionBody = editor.getValue();

        swal({
            title: "Create Action",
            text: "Are you sure you want to create action: '" + functionName + "'",
            type: "info",
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }, function(){
            $.post('create', {
                functionName: functionName,
                functionBody: functionBody
            }).done(function(data) {
                swal("Created!", "Your new action has been added.", "success");
                setTimeout( () => { window.location = getNewUrl(functionName); }, 1000);
            });
            setTimeout(function(){

        }, 2000); });
        return;
    });
}());
