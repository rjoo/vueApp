<template>
  <div v-bind:class="{ 'filter-keywords': true, 'filter-keywords-active': show }">
    <a href="#" class="filter-toggle" v-on:click.prevent="toggleFilter">{{ filterToggleText }}</a>
    <span class="filter-label" v-if="labelText">{{ labelText }}</span>
    <ul class="added-keywords" v-if="filterKeywords.length">
      <li v-for="keyword in filterKeywords">
        <span>{{ keyword }}</span>
        <a href="#" class="remove-keyword" v-on:click.prevent="onRemoveKeyword($index)"></a>
      </li>
    </ul>
    <div class="row collapse">
      <div class="small-8 columns">
        <input type="text" placeholder="{{ placeholder }}" v-model="filterKeyword" v-on:keyup.13="onAddKeyword">
      </div>
      <div class="small-4 columns">
        <a href="#" class="button secondary expanded" v-on:click.prevent="onAddKeyword">Add</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: true,
        filterKeywords: [],
        filterKeyword: '',
        filterToggleText: 'Hide Filters'
      }
    },
    props: ['labelText', 'placeholder'],
    methods: {
      onAddKeyword () {
        this.filterKeywords.push(this.filterKeyword)
        this.filterKeyword = ''
        this.$dispatch('filter-keywords-added', this.filterKeywords)
      },
      onRemoveKeyword (i) {
        this.filterKeywords.splice(i, 1)
      },
      toggleFilter () {
        this.show = !this.show

        if (this.show) {
          this.filterToggleText = 'Hide Filters'
        } else {
          this.filterToggleText = 'Show Filters'
        }
      }
    }
  }
</script>

<style lang="sass">
  @import '../assets/foundation/scss/util/util';

  $green: #71B68B;

  .filter-keywords {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 10px 20px 0px;
    width: 100%;
    background: $green;
    box-shadow: -2px -2px 10px rgba(black, 0.3);
    transition: all 0.25s cubic-bezier(.87,-.41,.19,1.44);
    transform: translateY(100%);

    @include breakpoint(medium) {
      max-width: 400px;
    }

    input {
      font-size: 12px;
    }
  }

  .filter-keywords-active {
    transform: translateY(0);

    .filter-toggle {
      transform: translateY(0);
    }
  }

  .filter-label {
    font-size: 12px;
    text-transform: uppercase;
  }

  .filter-toggle {
    position: absolute;
    top: 0;
    right: 0;
    padding: 2px 8px;
    background: darken($green, 20%);
    color: white;
    font-size: 11px;
    text-transform: uppercase;
    transition: all 0.25s;
    transform: translateY(-100%);
    
    &:focus,
    &:hover {
      color: darken(white, 10%);
    }
  }

  .added-keywords {
    margin: 10px 0;
    padding: 0;
    list-style-type: none;

    > li {
      position: relative;
      padding: 10px 0;
      border-bottom: 1px solid darken($green, 10%);
      font-size: 12px;
      text-transform: uppercase;

      span {
        padding-left: 20px;
      }
    }

    .remove-keyword {
      position: absolute;
      left: 0;
      top: 10px;
      color: white;
      width: 16px;
      height: 16px;

      &:after, &:before {
        content: '';
        position: absolute;
        top: 50%;
        height: 1px;
        width: 100%;
        border: 1px solid white;
      }

      &:after {
        transform: rotate(45deg);
      }
      &:before {
        transform: rotate(-45deg);
        transition: all 0.25s;
      }

      &:hover {
        &:before {
          transform: rotate(0deg);
        }
        &:after {
          border: none;
        }
      }
    }
  }

  .slide-transition {
    transition: all 0.25s;
  }

  .slide-enter {
    transform: translateY(0);
  }

  .slide-leave {
    transform: translateY(100%);
  }
</style>