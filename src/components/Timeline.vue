<template>
  <div class="timeline-wrapper" v-bind:class="{ 'timeline-is-active': timelineShown || isFinalized, 'timeline-is-finalized': isFinalized }" v-if="(events.length && startDate && endDate) || isFinalized">
    <a href="#" class="timeline-expand" v-bind:class="{ 'timeline-expanded': timelineShown }" v-on:click.prevent="toggleTimeline" v-if="!isFinalized">
      Timeline
      <span class="timeline-events-count" v-bind:class="{ 'scale-in-enter': eventCountChanged }">{{ events.length }}</span>
    </a>
    <div class="timeline-finalized-url row" v-if="finalizedGuid">
      <div class="small-6 columns">
        <p><strong>All done!</strong> Use the Finalized URL to access your selected events at any time.</p>
        <p>This is a simple app created with <a href="http://vuejs.org/">Vue.js</a> to explore the capabilities and reactivity between various components and states.</p>
      </div>
      <div class="small-6 columns">
        <label>Finalized URL</label>
        <input type="text" readonly value="http://{{ baseUrl }}/?t={{ finalizedGuid }}">
        <a href="#" class="button secondary" v-on:click.prevent="copyToClipboard">Copy to Clipboard</a>
      </div>
    </div>
    <a href="#" class="timeline-finalize button success" v-on:click.prevent="onFinalize" v-if="!isFinalized">Finalize</a>
    <div class="timeline-days">
      <div class="timeline-day" v-for="events in dayEvents">
        <h3>{{ $key }}</h3>
        <ul class="timeline-events" v-if="events.length">
          <li class="timeline-event" v-for="event in events">
            <span class="timeline-event-time">{{ formatTime(event.start_time) }}</span>:
            <a href="{{ event.url }}" target="_blank"><span class="timeline-event-title">{{ event.title }}</span></a> @
            <a href="{{ event.venue_url }}" target="_blank"><span class="timeline-event-venue">{{ event.venue_name }}</span></a>
          </li>
        </ul>
        <p v-else>No events selected</p>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import request from 'superagent'

  export default {
    data () {
      return {
        startHour: 8,
        endHour: 20,
        timelineShown: false,
        eventCountChanged: false,
        finalizedGuid: '',
        finalizationError: '',
        baseUrl: window.location.hostname
      }
    },
    computed: {
      dayEvents () {
        if (Object.keys(this.finalizedDayEvents).length) return this.finalizedDayEvents

        let days = {}
        let startDate = moment(this.startDate)
        let endDate = moment(this.endDate)
        let diff = endDate.diff(startDate, 'days')

        for (let i = 0; i <= diff; i++) {
          let formattedDate = startDate.format('dddd, MMMM DD, YYYY')

          days[formattedDate] = this.events.filter((event) => {
            return moment(event.start_time).isSame(startDate, 'day')
          }).sort((a, b) => {
            let d1 = moment(a.start_time)
            let d2 = moment(b.start_time)

            if (d1.isBefore(d2)) return -1

            if (d1.isAfter(d2)) return 1

            return 0
          })

          startDate.add(1, 'day')
        }

        return days
      }
    },
    methods: {
      formatTime (d) {
        return moment(d).format('hh:mmA')
      },
      toggleTimeline () {
        this.timelineShown = !this.timelineShown
      },
      // sends timeline to server to save
      onFinalize () {
        console.log('dayEvents', this.dayEvents)

        request
          .post('/finalize')
          .send('timeline=' + encodeURIComponent(JSON.stringify(this.dayEvents)))
          .send('location=')
          .end((err, res) => {
            if (err) {
              console.log('error finalizing', err)
            } else {
              if (res.body.success) {
                this.finalizedGuid = res.body.guid

                this.$dispatch('finalized', true)
              } else {
                this.finalizationError = res.body.message
              }
            }
          })
      },
      copyToClipboard () {
      }
    },
    watch: {
      events () {
        this.eventCountChanged = true

        setTimeout(() => {
          this.eventCountChanged = false
        }, 500)
      }
    },
    props: ['startDate', 'endDate', 'events', 'finalizedDayEvents', 'isFinalized']
  }
</script>

<style lang="sass">
  @import '../assets/foundation/scss/util/util';

  $steel-blue: #A1A7C3;

  .timeline-wrapper {
    position: fixed;
    background: $steel-blue;
    box-shadow: -5px 0 10px rgba(black, 0.3);
    padding: 100px 20px 20px;
    top: 1rem;
    right: -10px;
    width: 100%;
    height: 100vh;
    z-index: 12;
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(.87,-.41,.19,1.15);

    @include breakpoint(large) {
      width: 75%;
    }
  }

  .timeline-is-finalized {
    width: 100%;
    box-shadow: none;
    left: 0;
    right: auto;
    padding-top: 30px;
  }

  .timeline-is-active {
    position: fixed;
    transform: translateX(0);

    .timeline-expand {
      border: 1px solid white;
      border-left: 0;
      transform: translateX(0);

      &:before {
        left: 10px;
        @include css-triangle(10px, white, right);
      }
    }
  }

  .timeline-expand {
    position: absolute;
    padding: 2px 10px 0 0;
    top: 20px;
    left: 0;
    width: 100px;
    height: 40px;
    background: $steel-blue;
    color: white;
    font-size: 11px;
    font-weight: bold;
    text-align: right;
    text-transform: uppercase;
    transform: translateX(-110%);
    transition: all 0.25s 0.25s;
    
    &:focus,
    &:hover {
      color: white;
    }

    &:before {
      @include css-triangle(10px, white, left);
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.5s 0.5s;
    }
  }

  .timeline-finalized-url {
    font-size: 18px;
  }

  .timeline-finalize {
    position: absolute;
    top: 20px;
    right: 22px;
    min-width: 200px;
  }

  .timeline-events-count {
    position: absolute;
    bottom: 5px;
    right: 10px;
    font-size: 18px;
    line-height: 1;
  }

  .timeline-days {
    display: flex;
    flex-wrap: wrap;
  }

  .timeline-day {
    background: white;
    margin: 0 0 20px;
    padding: 10px 20px;
    width: 100%;
    vertical-align: top;
    font-size: 12px;

    > h3 {
      font-size: 20px;
    }

    @include breakpoint(medium) {
      width: calc(25% - 8px);
      margin-right: 10px;

      &:nth-child(4n + 4) {
        margin-right: 0;
      }
    }
  }

  .timeline-events {
    margin: 0;
    list-style-type: none;

    .timeline-event {
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid rgba($steel-blue, 0.5);

      &:last-child {
        margin-bottom: 0;
        border-bottom: 0;
      }
    }

    .timeline-event-time,
    .timeline-event-title {
      font-weight: bold;
    }

    .timeline-event-venue {
      font-style: italic;
    }
  }

  .scale-in-enter {
    animation: scaleIn 0.5s;
  }

  @keyframes scaleIn {
    0% {
      transform: scale(2);
    }

    100% {
      transform: scale(1);
    }
  }
</style>