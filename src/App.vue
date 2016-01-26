<template>
  <div id="app">
    <progress v-bind:progress="progress" v-bind:progress-text="progressText"></progress>

    <div class="row">
      <div class="small-12 column text-center">
        <h3>Visiting a New City?</h3>
        <p>Explore it to the fullest by discovering local events happening during your stay.</p>
      </div>
    </div>

    <search
      v-if="progress != '100%'"
      v-on:start-date-selected="startSelected"
      v-on:end-date-selected="endSelected"
      v-on:location-entered="locationEntered"
      v-on:step-completed="onStepOneComplete">
    </search>

    <events
      v-if="progress != '100%' && stepOneDone"
      v-bind:start-date="selectedStartDate"
      v-bind:end-date="selectedEndDate"
      v-bind:location="selectedLocation"
      v-bind:selected-events="selectedEvents"
      v-on:event-selected="onEventSelected"
      v-on:event-removed="onEventRemoved">
    </events>

    <div class="row">
      <div class="small-12 column">
        <div class="eventful-badge eventful-small">
          <img src="http://api.eventful.com/images/powered/eventful_58x20.gif"
            alt="Local Events, Concerts, Tickets">
          <p><a href="http://eventful.com/">Events</a> by Eventful</p>
        </div>
      </div>
    </div>

    <timeline
      :finalized-day-events="finalizedEvents"
      v-bind:start-date="selectedStartDate"
      v-bind:end-date="selectedEndDate"
      v-bind:events="selectedEvents"
      v-bind:is-finalized="timelineFinalized"
      v-on:finalized="onFinalized"></timeline>
  </div>
</template>

<script>
import Progress from './components/Progress'
import Search from './components/Search'
import Events from './components/Events'
import Timeline from './components/Timeline'
import request from 'superagent'

export default {
  data () {
    return {
      selectedStartDate: '',
      selectedEndDate: '',
      selectedLocation: '',
      selectedEvents: [],
      progress: '10%',
      progressText: 'Select Dates',
      finalizedEvents: {},
      stepOneDone: false,
      timelineFinalized: false
    }
  },
  components: {
    Progress,
    Search,
    Events,
    Timeline
  },
  methods: {
    startSelected (d) {
      this.stepOneDone = false
      this.selectedStartDate = d
      this.progress = '20%'
    },
    endSelected (d) {
      this.stepOneDone = false
      this.selectedEndDate = d
      this.progress = '40%'
    },
    locationEntered (l) {
      this.stepOneDone = false
      this.selectedLocation = l
    },
    onStepOneComplete () {
      this.stepOneDone = true
      this.progress = '50%'
      this.progressText = 'Select Events'
    },
    onEventSelected (event) {
      this.progress = '80%'
      this.progressText = 'Finalize'
      this.selectedEvents.push(event)
    },
    onEventRemoved (id) {
      this.selectedEvents = this.selectedEvents.filter((event) => {
        return event.id !== id
      })
    },
    onFinalized () {
      this.progress = '100%'
      this.progressText = 'Finalized!'
      this.timelineFinalized = true
    },
    getTimeline (guid) {
      request
        .get('/timeline?t=' + guid)
        .end((err, res) => {
          if (err) return false

          try {
            let dayEvents = res.body.timeline

            if (dayEvents) {
              this.onFinalized()
              this.finalizedEvents = dayEvents
            }
          } catch (err) {
          }
        })
    }
  },
  created () {
    let params = window.location.search.substr(1)

    if (params) {
      params.split('&').forEach((p) => {
        let ps = p.split('=')

        if (ps[0] === 't' && ps[1]) {
          this.getTimeline(ps[1])
        }
      })
    }
  }
}
</script>

<style lang="sass">
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,700|Droid+Serif:400,700);
  @import 'assets/foundation/scss/foundation';
  @include foundation-everything;

  #app {
    position: relative;
    padding-top: 50px;
  }

  .eventful-badge,
  .eventful-badge * {
    margin: 0;
    padding: 0;
    border: 0;
    text-align: center;
    color: #CCC;
    font-family: Arial;
    text-decoration: none;
  }

  .eventful-large {
    position: relative;
    width: 140px;
    font-size: 15px;
    line-height: 17px;
    font-weight: bold;
  }

  .eventful-medium {
    position: relative;
    width: 100px;
    font-size: 12px;
    line-height: 13px;
  }

  .eventful-small {
    position: relative;
    width: 100px;
    font-size: 11px;
    line-height: 11px;
  }
</style>