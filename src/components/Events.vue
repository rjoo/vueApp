<template>
  <div class="events-list row">
    <loader v-if="loading"></loader>
    
    <div class="small-12 columns" v-if="errorMsg">
      <p class="errors">{{ errorMsg }}</p>
    </div>

    <div class="small-12 columns" v-if="events.length && startDate && endDate && location">
      <div class="row small-up-1 medium-up-2 large-up-3">
        <div class="column"
          v-for="event in events | searchFor filterKeywords 'venue_name, city_name, title, region_name, description' | count"
          transition="bounce">
          <div class="event">
            <div class="event-details">
              <h3 class="event-title">{{ event.title }}</h3>
              <span class="event-venue"><a href="{{ event.venue_url }}" target="_blank">{{ event.venue_name }}</a> in {{ event.city_name }}, {{ event.region_abbr }}</span>
              <span class="event-date">{{ formatDate(event.start_time) }}<span v-if="event.stop_time"> to {{ formatDate(event.stop_time) }}</span></span>
              <!-- <p class="event-description">{{ event.description }}</p> -->
            </div>
            <div class="event-actions">
              <a href="{{ event.url }}" class="expanded button success" target="_blank">Learn More</a>
              <a href="#" class="expanded button warning" v-if="isSelectedEvent(event.id)" v-on:click.prevent="onEventRemoved(event.id)">Remove</a>
              <a href="#" class="expanded button" v-else v-on:click.prevent="onEventAdded(event)">Add to Timeline</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="small-12 columns" v-if="isThereMoreEvents">
      <loader v-if="loading"></loader>
      <a href="#" class="button" v-on:click.prevent="update">Load More Events</a>
    </div>
  </div>

  <filter-keywords v-if="status.pageSize" v-bind:label-text="status.text" v-on:filter-keywords-added="onFilterInput" placeholder="Keywords (eg. Theatre, Lunch, Festival)"></filter-keywords>
</template>

<script>
  import Loader from './Loader'
  import FilterKeywords from './FilterKeywords'
  import store from '../EventStore'
  import moment from 'moment'

  export default {
    data () {
      return {
        loading: true,
        events: [],
        filterKeywords: [],
        filteredLength: 0,
        errorMsg: '',
        page: 1,
        status: {
          pageNumber: 0,
          pageSize: 0,
          totalItems: 0,
          text: ''
        }
      }
    },
    components: {
      Loader,
      FilterKeywords
    },
    created () {
      if (!this.events.length) {
        this.update()
      }
    },
    computed: {
      isThereMoreEvents () {
        return this.events.length < +this.status.totalItems
      }
    },
    methods: {
      formatDate (d) {
        return moment(d).format('h:mmA dddd (MMMM DD, YYYY)')
      },
      update () {
        var query = {
          date: [this.startDate.replace(/-/g, '') + '00', this.endDate.replace(/-/g, '') + '00'].join('-'),
          pageNumber: this.status.pageNumber + 1,
          pageSize: 50,
          location: this.location
        }

        this.loading = true

        store.searchEvents(query).then(
          (data) => {
            this.loading = false
            this.errorMsg = ''

            if (data.events) {
              this.events = this.events.concat(data.events.event)
            } else {
              this.errorMsg = 'Sorry, couldn\'t load any events!'
              return false
            }

            if (!this.events.length) {
              this.errorMsg = 'Sorry, there are no events for your stay!'
            }

            this.status.pageNumber = (+data.page_number)
            this.status.pageSize += (+data.page_size)
            this.status.totalItems = data.total_items
            this.status.text = 'Showing ' + this.filteredLength + ' events out of ' + data.total_items
          },
          (err) => {
            this.loading = false
            this.errorMsg = 'Sorry, couldn\'t load any events!'

            console.log(err)
          })
      },
      isSelectedEvent (id) {
        return this.selectedEvents.filter((event) => {
          return event.id === id
        }).length
      },
      onFilterInput (keywords) {
        if (keywords) {
          this.filterKeywords = keywords
        } else {
          this.filterKeywords = []
        }
      },
      onEventAdded (event) {
        this.$dispatch('event-selected', event)
      },
      onEventRemoved (id) {
        if (id) {
          this.$dispatch('event-removed', id)
        }
      }
    },
    filters: {
      searchFor (data, searchArr, keys) {
        // nothing to search for
        if (!searchArr.length) return data

        keys = keys.split(', ')
        let matches = []

        data.forEach((d) => {
          // make a big string to lookup
          let lookUpString = keys.map((key) => {
            if (typeof d[key] === 'string') return d[key]
            else return ''
          }).join(' ')

          if (searchArr.filter(search => { return lookUpString.toLowerCase().indexOf(search.toLowerCase()) !== -1 }).length) {
            matches.push(d)
          }
        })

        return matches
      },
      count (arr) {
        this.$set('filteredLength', arr.length)
        this.status.text = 'Showing ' + this.filteredLength + ' events out of ' + this.events.length

        return arr
      }
    },
    props: ['startDate', 'endDate', 'location', 'selectedEvents'],
    transitions: {
      bounce (i) {
        return Math.min(300, i * 50)
      }
    }
  }
</script>

<style lang="sass">
  .events-list {
    padding: 40px 0;
  }

  .event {
    border: 1px solid #c2c2c2;
    border-radius: 4px;
    margin: 20px 0;
    padding: 20px;
  }

  .event-details {
    padding-bottom: 20px;
  }

  .event-title {
    font-size: 16px;
    font-weight: bold;
  }

  .event-venue {
    display: block;
    padding-bottom: 10px;
    font-weight: bold;
    font-size: 11px;
    text-transform: uppercase;
  }

  .event-date {
    display: block;
    font-size: 12px;
  }

  .event-description {
    font-size: 14px;
  }

  .bounce-transition {
    // transition: all 0.3s bounce;
  }
  .bounce-enter {
    animation: bounce-in 0.5s cubic-bezier(.87,-.41,.19,1.44);
  }
  .bounce-leave {
    animation: bounce-out 0.5s cubic-bezier(.87,-.41,.19,1.44);
  }
  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0)
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1)
    }
    100% {
      opacity: 1;
      transform: scale(1)
    }
  }
  @keyframes bounce-out {
    0% {
      opacity: 1;
      transform: scale(1)
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1)
    }
    100% {
      opacity: 0;
      transform: scale(0)
    }
  }
</style>