"use strict"

function createEditor(name){
   let editor = ace.edit(name);
   editor.setTheme("ace/theme/monokai");
   editor.getSession().setMode("ace/mode/javascript");
   editor.setFontSize(14);

   return editor;
}
let getFunctionCode = (functionName) => request.get("functions/" + functionName + ".js");

// Update Test Action - regions, actions
;(function (){
    const appendOptions = (listOfOptions, $elem) => listOfOptions.forEach( option => $("<option>" + option + "</option>").appendTo($elem) );

    $.when($.getJSON('regions'), $.getJSON('actions'))
        .then((regions, actions) => {
            appendOptions(regions[0], $('#regions'));
            appendOptions(actions[0], $('#actions'));
        });
}());

// Function Run Params Editor
;(function (){
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

      getFunctionCode(selectedFunction.value).then((code) => paramsEditor.getSession().setValue(code));
   }

   var paramsEditor = createEditor("params-editor");
   $("#actions").change(function() {
      updateEditorCode();
   });

   updateEditorCode();
}());

// Create Functions Editor
;(function (){
   getFunctionCode("base_code")
      .then(function (data){
         var functionEditor = createEditor("create-function-editor");
         functionEditor.getSession().setValue(data);
   });
}());

// Edit Functions Editor
;(function (){
   $('#myModal').on('show.bs.modal', function (e) {
      $("#edit-function_name").val($("#actions option:selected")[0].value);
      createEditor("edit-function-editor").getSession().setValue(createEditor("params-editor").getSession().getValue());
   });
}());

// Test submit;
;(function (){
    $("#test_submit").click(function(event) {
        event.preventDefault();

        let selectedRegion = $("#regions").val();
        let selectedAction = $("#actions").val();
        let requestParams = JSON.parse($("#request_params").val() || "{}");

        // TODO - add get file content of input from text area

        $.post('run', {
            region: selectedRegion,
            action: selectedAction,
            params: requestParams
        }).done(function(data) {
            $("#result").empty().text(JSON.stringify(data, null, '\t'));
        });
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
                setTimeout(function (){window.location.reload()}, 1000 * 3);
            });
            setTimeout(function(){

        }, 2000); });
        return;
    });
}());

// Edit Submit
;(function (){
   $('#edit_submit').on('click', function (){
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
             setTimeout(function (){$('#myModal').modal('hide'); window.location.reload()}, 1000 * 2);
          });
          setTimeout(function(){
      }, 2000); });
      return;
   });
}());
