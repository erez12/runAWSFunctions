"use strict"

;(function (){
    const appendOptions = (listOfOptions, $elem) => listOfOptions.forEach( option => $("<option>" + option + "</option>").appendTo($elem) );
    console.log('running');

    $.when($.getJSON('regions'), $.getJSON('actions'))
        .then((regions, actions) => {
            appendOptions(regions[0], $('#regions'));
            appendOptions(actions[0], $('#actions'));
        });
}());

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

    $("#create_submit").click(function(event) {
        event.preventDefault();

        let functionName = $("#function_name").val()
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
