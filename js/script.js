var dataPartijen = [
    "SGP",
    "VVD",
    "PvdA",
    "ChristenUnie",
    "CDA",
    "VKGO",
    "EILAND van VRIJHEID",
    "Goeree Overflakkee Samen",
    "JEZUS LEEFT",
    "Groep Jan Zwerus",
]

var dataScores = {};

var dataThemas = {};

(function() {
    dataPartijen.forEach(function(partij){
        dataScores[partij] = 0;
    });

    dataStandpunten.forEach(function(themaObject){
        dataThemas[themaObject['thema']] = "";
    });
})();

// register the results component
Vue.component('results', {
    template: '#results-template',
    props: { 
        results: Object,
    },
    methods: {
        orderList: function (array) {
            var sortable = []
            for (var item in array) {
                sortable.push([item, array[item]])
            }

            sortable.sort(function(a, b) {
                return b[1] - a[1]
            });

            var sorted = {}

            sortable.forEach(function(item, index) {
                sorted[item[0]] = item[1];
            });

            return sorted
        } 
    }
})

// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }, 

        randomize: function(array) {
            myArray = []
            array.forEach(function(key){
                myArray.push(key)
            });
            console.log('randomized');
            return myArray.sort(function(a, b){return 0.5 - Math.random()})
        },

        updateScore: function (thema, partij, checkbox) {
            console.log(partij);
            console.log(document.getElementById(checkbox));

            if (document.getElementById(checkbox).checked) {
                dataScores[partij] ++;
            }
            else {
                dataScores[partij] --;
            }

            console.log(dataScores[partij]);
        }
    },
    mounted: function () {
        $('.slick').slick({
            dots: true,
            infinite: false,
            speed: 900,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: 1170,
                settings: {
                  slidesToShow: 3,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                }
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1,
                }
              }
            ]
        });
    }
})

// bootstrap the demo
var demo = new Vue({
    el: '#demo',
    data: {
        searchQuery: '',
        gridColumns: dataPartijen,
        gridData: dataStandpunten,
        gridResults: dataScores
    }
})