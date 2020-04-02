<template>
    <div>
        <fusioncharts
        :type="type"
        :width="width"
        :height="height"
        :dataFormat="dataFormat"
        :dataSource="dataSource"
        ></fusioncharts>
    </div>
</template>

<script>
    import FusionCharts from 'fusioncharts';

    const dossierData = {}

    function importAll (r) {
        r.keys().forEach(key => dossierData[key] = r(key));
    }

    importAll(require.context('../assets/SteamData/', true, /.json$/));

    let schema = [{
        name: "date",
        type: "date",
        format: "%Y-%m-%d %H:%M:%S %Z" // 2020-03-09 07:30:01 +0100
    },
    {
        name: "nbJoueurs",
        type: "number"
    }];
    
    export default {

        props: {
            nomJeu: {
                type: String,
                default: "",
                require: true
            },
        },

        data() {
            return { 
                trouve: false,
                indexH: "",
                jsonFile: Object,
                width: "100%",
                height: "400",
                type: "timeseries",
                dataFormat: "json",
                dataSource: {
                    caption: { text: "Nombres de joueurs maximum connecté en même temps sur " },
                    data: null,
                    chart: {
                        showLegend: 0,
                        theme: "candy"
                    },
                    yAxis: [
                    {
                        plot: {
                        value: 'Daily Visitors',
                        type: 'area'
                        },
                        title: 'Nombres de joueurs'
                    }
                    ]
                }
            }
        },
        
        watch: {
            nomJeu: function(){
                this.searchIdGames();
                this.searchGame();
            }
        },

        methods: {

            searchIdGames() {

                this.trouve = false;

                Object.keys(dossierData).forEach( fichier => {
                    if ( dossierData[fichier].nom_jeu == this.nomJeu ) {
                        console.log( dossierData[fichier])
                        this.indexH = fichier;
                        this.trouve = true;
                    }
                })

                if ( this.trouve == false )
                    this.indexH = "";
            },

            searchGame() {
                if ( this.trouve == true ) {
                    Promise.all([dossierData[this.indexH].points, schema]).then(res => {
                        const data = res[0];
                        const schema = res[1];
                        const fusionTable = new FusionCharts.DataStore().createDataTable(
                        data,
                        schema
                        );
                        this.dataSource.data = fusionTable;

                        this.dataSource.caption.text = "Nombres de joueurs maximum connecté en même temps sur " + this.nomJeu;
                    });
                } else {
                    this.dataSource.data = {};
                }
            }
        }
    }
</script>

<style scoped>

</style>