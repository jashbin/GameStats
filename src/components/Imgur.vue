<template>
  <b-container fluid class="p-0 w-100 h-100" style="background-color: #602080;">
    <b-col class="pt-2 pb-2 d-flex justify-content-center" style="border-bottom: 3px solid white;">
      <!-- Options de recherche -->
      <b-button-toolbar>
        <b-dropdown id="dropdown" :text="'Sort by ' + sortChoice + ' '">
          <b-dropdown-item
            v-for="sort in sortOptions"
            :key="sort"
            @click="sortChoice = sort"
          >{{ sort }}</b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="dropdown" :text="'of ' + dateChoice + ' '" v-show="sortChoice == 'top'">
          <b-dropdown-item
            v-for="date in dateOptions"
            :key="date"
            @click="dateChoice = date"
          >{{ date }}</b-dropdown-item>
        </b-dropdown>
      </b-button-toolbar>
      <!-- Changement de page -->
      <b-button-toolbar key-nav>
        <b-button-group class="mx-1">
          <b-button @click="pagesPrecedentes">&laquo;</b-button>
          <b-button @click="pagePrecedente">&lsaquo;</b-button>
        </b-button-group>
        <b-button disabled>{{ page }}</b-button>
        <b-button-group class="mx-1">
          <b-button @click="pageSuivante">&rsaquo;</b-button>
          <b-button @click="pagesSuivantes">&raquo;</b-button>
        </b-button-group>
      </b-button-toolbar>
    </b-col>
    <b-col class="sc1" style="overflow: auto; height: 88%;">
      <ImgurSearch
        :search="search"
        :heightImg="heightImg"
        :page="page"
        :sort="sortChoice"
        :date="dateChoice"
      />
    </b-col>
  </b-container>
</template>

<script>
import ImgurSearch from "./ImgurSearch.vue";

export default {
  components: {
    ImgurSearch
  },
  props: {
    search: {
      type: String,
      default: "game"
    },
    heightImg: {
      type: Number,
      default: 30,
      validator: function(value) {
        return value > 5;
      }
    }
  },
  data() {
    return {
      sortOptions: ["time", "viral", "top"],
      dateOptions: ["day", "week", "month", "year", "all"],
      page: 1,
      sortChoice: "time",
      dateChoice: "all"
    };
  },
  methods: {
    pageSuivante: function() {
      this.page += 1;
    },
    pagePrecedente: function() {
      if (this.page > 1) this.page -= 1;
    },
    pagesPrecedentes: function() {
      if (this.page - 10 > 0) this.page -= 10;
      else this.page = 1;
    },
    pagesSuivantes: function() {
      this.page += 10;
    }
  }
};
</script>

<style scoped>
/* Scroll 1 */
.sc1::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.sc1::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}
.sc1::-webkit-scrollbar-thumb {
  background-color: #dfdfdf;
  border-radius: 10px;
}
</style>
