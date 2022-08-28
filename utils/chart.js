var myChart = null;
function drawChart(data) {
  if (myChart != null) {
    myChart.destroy();
  }
  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        data[0].Month,
        data[1].Month,
        data[2].Month,
        data[3].Month,
        data[4].Month,
        data[5].Month,
        data[6].Month,
        data[7].Month,
        data[8].Month,
        data[9].Month,
        data[10].Month,
        data[11].Month,
      ],
      datasets: [
        {
          label: "Doanh Thu",
          data: [
            data[0].DoanhThu,
            data[1].DoanhThu,
            data[2].DoanhThu,
            data[3].DoanhThu,
            data[4].DoanhThu,
            data[5].DoanhThu,
            data[6].DoanhThu,
            data[7].DoanhThu,
            data[8].DoanhThu,
            data[9].DoanhThu,
            data[10].DoanhThu,
            data[11].DoanhThu,
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function render(data) {
  var year = document.getElementById("select-year").value;
  var subData = data.filter((item) => item.Year == year);
  drawChart(subData);
}

$(document).on("change", "#select-year", function () {

  $.getJSON(`/admin/statistics/revenue`, function (data) {
    if (data.length > 0) {
      drawChart(data);
    }
  });
});