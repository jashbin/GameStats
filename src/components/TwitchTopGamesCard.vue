<template>
    <div class="cardGame d-flex flex-column rounded m-1" :style="{width: card_width + 'px'}">
        <!-- Image -->
        <div class="m-1 text-center" v-show="isLoad">
        <img class="rounded img-fluid max-height: 100%" :src="url_img" @load="loaded" />
        </div>
        <div class="m-1 text-center" v-show="!isLoad">
        <b-spinner variant="danger" label="Spinning"></b-spinner>
        </div>

        <!-- Titre jeu -->
        <div class>
        <div class="text-truncate text-center">{{title}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url_img: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            card_width: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                isLoad: false
            };
        },
        methods: {
            loaded() {
                this.isLoad = true;
            }
        }
    };
</script>

<style scoped>
.cardGame {
  background-color: #602080;
  color: white;
  padding: 6px;
}
</style>