<script>

import { Bar } from 'vue-chartjs'

export default {
    props: ['total'],
    data() {
        return {
            graphData: null,
            months: ['Januar','Februar','Marec','April','Maj','Junij','Julij','Avgust','September','Oktober', 'November', 'December'],
            borderColor: ['#0259ac','#FF0000','#00CC00','#FFFF00']
        }
    },
    extends: Bar,
    mounted() {
        this.graphData = this.total
    },
    methods: {
        newGraph(datasetsArray) {
            this.renderChart({
                labels: this.months,
                datasets: datasetsArray
            }, {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                return value + ' €'
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItems, data) {
                            return Math.round(tooltipItems.yLabel * 100) / 100 + ' €';
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false
            })
        },
      addDataToGraph(params) {
        let datasets = []
        let index = 0
        params.forEach(param => {
          datasets.push({
            label: `Leto ${param.year}`,
            backgroundColor: '#ecf1f6',
            data: param.priceByMonth,
            borderWidth: 1,
            borderColor: this.borderColor[index]
          })
          index++
        })

        this.newGraph(datasets)
      }
    },
    watch: {
        total: {
            handler() {
                this.addDataToGraph(this.total)
            },
            deep: true
        }
    }
}
</script>

<style scoped>

</style>
