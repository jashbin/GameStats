<template>
    <b-col class="p-3 w-100" style="background-color: #602080; color: white;">
        <div id="test">
            <h1>
                Tournois a venir : {{nomTournoisg}}
            </h1>
        </div>
    </b-col>
</template>

<script>

    var request = require('request');

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
                image: String,
                apiUrl1: 'http://localhost:3000/liquipedia/',
                apiUrl2: 'http://localhost:3000/liquipediaDetails/',
                nomTournoisg: '',
                TounoisURL: ''
            }
        },

        methods: {

            async sendToLocalApi(url, body, callback){
                console.log("Call request : " + url + "\t" + body)
                await request.get({
                    url: url+body,
                }, function(error, response, resBody){
                        callback(JSON.parse(resBody));
                });
            },

            async sendToLocalApi2(url, body, callback){
                console.log("Call request : " + url + "\t" + body)
                await request.get({
                    url: url+body,
                }, function(error, response, resBody){
                        callback(JSON.parse(resBody));
                });
            },

            async getGame(name, callback){
                await this.sendToLocalApi(this.apiUrl1, name, callback);
            },

            async getTournament(name, tournamentName, callback){
                await this.sendToLocalApi2(this.apiUrl1, name, callback);
            },

            async getInfo() {
                let detailsTournois;
                let self = this;
                await this.getGame( self.nomJeu /*"counterstrike"*/, function(data) {

                    console.log( data);

                    if ( data != [] && data.query.meta.count != 0 ) {

                        for (let [key, value] of Object.entries(data.query.results)) {

                            console.log( key);
                            detailsTournois = value;

                            break;
                        }
                        self.nomTournoisg = detailsTournois.displaytitle;
                    } else {
                        self.nomTournoisg = 'aucun tournoi professionnel prochainement'
                    }
                });
            }
        },

        watch: {
            nomJeu: function(){
                this.getInfo()
            }
        }

        /*mounted: function() {

            this.getInfo();
        }*/
    }
</script>

<style>

</style>