<template>
  <div class="autocomplete-wrapper">
    <input type="text" placeholder="{{ placeholder }}" v-model="keywords" v-on:keyup="onKeyup | debounce 350">
    <ul class="results-list" v-if="results.length">
      <li class="results-item" v-for="result in results">
        <a href="#" class="results-link" v-on:click.prevent="onResultClick(result)">{{ result }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        oldKeywords: '',
        keywords: '',
        results: []
      }
    },
    props: ['placeholder', 'endpoint'],
    methods: {
      onKeyup () {
        if (this.keywords && this.oldKeywords !== this.keywords) {
          this.oldKeywords = this.keywords

          this.endpoint(this.keywords)
            .then((results) => {
              if (results.length) {
                this.results = results
              } else {
                this.results = []
              }
            }, (err) => {
              console.log('autocomplete ajax error', err)
            })
        }
      },
      onResultClick (result) {
        this.keywords = result
        this.results = []
        this.$dispatch('completed', this.keywords)
      }
    }
  }
</script>

<style lang="sass">
  $green: #71B68B;

  .autocomplete-wrapper {
    position: relative;
  }

  .results-list {
    position: absolute;
    top: 40px;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid #c2c2c2;
    list-style-type: none;
    background: white;
    z-index: 10;
  }

  .results-item {
  }

  .results-link {
    display: block;
    padding: 5px 10px;
    width: 100%;

    &:hover {
      background: $green;
      color: white;
    }
  }
</style>