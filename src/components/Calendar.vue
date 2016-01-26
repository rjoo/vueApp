<template>
  <div class="date-selection row">
    <div class="small-6 columns">
      <label>Start Date</label>
      <input type="text" class="date-input" v-pikaday="startDate">
    </div>
    <div class="small-6 columns">
      <label>End Date</label>
      <input type="text" class="date-input" v-pikaday="endDate" v-bind:start="startDate">
    </div>
    <div class="small-12 medium-6 medium-pull-3 column">
      <div class="callout" v-if="startDate || endDate">
        <p class="text-center">
          <span v-if="startDate" transition="fade">
            You've arriving <strong>{{ format(startDate) }}</strong>
          </span>
          <span v-if="endDate" transition="fade">
            and departing <strong>{{ format(endDate) }}</strong>
          </span>
        </p>
      </div>
      <a href="#"
        v-bind:class="{ 'expanded': true, 'button': true, 'disabled': completed }"
        v-if="startDate && endDate"
        v-on:click="stepCompleted"
        transition="fade">
        Check Events
      </a>
    </div>
  </div>
</template>

<script>
  import Pikaday from 'pikaday'
  import Vue from 'vue'
  import moment from 'moment'

  Vue.directive('pikaday', {
    twoWay: true,
    bind () {
      var s = this

      this.picker = new Pikaday({
        field: this.el,
        format: 'MM/DD/YYYY',
        minDate: new Date(),
        onSelect: function () {
          var d = this.getMoment().format('YYYY-MM-DD')
          s.set(d)
          s.vm.notify(s.expression)
        }
      })
    },
    update (val) {
      // this.picker.setDate(val.toDate())
    },
    unbind () {
      this.picker.destroy()
    },
    params: ['start'],
    paramWatchers: {
      start (date) {
        var d = moment(date)

        this.picker.setMinDate(d.add(1, 'day').toDate())
        this.picker.gotoDate(d.toDate())
      }
    }
  })

  export default {
    data () {
      return {
        startDate: '',
        endDate: '',
        completed: false
      }
    },
    methods: {
      format (d) {
        return moment(d).format('MMMM DD, YYYY')
      },
      notify (exp) {
        this.completed = false

        if (exp === 'startDate') {
          this.$dispatch('start-date-selected', this.startDate)
        } else if (exp === 'endDate') {
          this.$dispatch('end-date-selected', this.endDate)
        }
      },
      stepCompleted () {
        this.completed = true
        this.$dispatch('step-completed')
      }
    }
  }
</script>

<style lang="sass">
  @import '~pikaday/scss/pikaday';
  @import '../assets/foundation/scss/util/util';

  .date-selection {
    position: relative;
    padding: 40px 0 20px;
    background: #a2a2a2;
    transition: transform 0.35s ease-out;

    @include breakpoint(medium) {
      padding: 40px 20px 20px;
    }
  }

  .move-up {
    transform: translateY(-100%);

    .move-down {
      display: block;
    }
  }

  .date-input {
    padding: 20px;
    font-weight: bold;
  }

  .fade-transition {
    opacity: 1;
    transition: opacity 0.5s ease;
  }

  .fade-enter,
  .fade-leave {
    opacity: 0;
  }
</style>