Dropzone.autoDiscover = false;

function init() {
  let dz = new Dropzone("#dropzone", {
    url: "/",
    maxFiles: 1,
    addRemoveLinks: true,
    dictDefaultMessage: "Some Message",
    autoProcessQueue: false,
  });

  dz.on("addedfile", function () {
    if (dz.files[1] != null) {
      dz.removeFile(dz.files[0]);
    }
  });

  dz.on("complete", function (file) {
    let imageData = file.dataURL;

    var url = "/classify_image";

    $.post(
      url,
      {
        image_data: file.dataURL,
      },
      function (data, status) {
        console.log(data);
        if (!data || data.length == 0) {
          $("#resultHolder").hide();
          $("#divClassTable").hide();
          $("#error").show();
          return;
        }
        let players = [
          "lionel_messi",
          "maria_sharapova",
          "roger_federer",
          "serena_williams",
          "virat_kohli",
        ];

        let match = null;
        let bestScore = -1;
        for (let i = 0; i < data.length; ++i) {
          let maxScoreForThisClass = Math.max(...data[i].class_probability);
          if (maxScoreForThisClass > bestScore) {
            match = data[i];
            bestScore = maxScoreForThisClass;
          }
        }
        if (match) {
          $("#error").hide();
          $("#resultHolder").show();
          $("#divClassTable").show();
          $("#resultHolder").html($(`[data-player="${match.class}"`).html());
          let classDictionary = match.class_dictionary;
          for (let personName in classDictionary) {
            let index = classDictionary[personName];
            let proabilityScore = match.class_probability[index];
            let elementName = "#score_" + personName;
            $(elementName).html(proabilityScore);
          }
        }
      }
    );
  });

  $("#submitBtn").on("click", function (e) {
    dz.processQueue();
  });
}

$(document).ready(function () {
  console.log("ready!");
  $("#error").hide();
  $("#resultHolder").hide();
  $("#divClassTable").hide();

  init();
});
