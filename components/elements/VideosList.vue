<template>

  <div class="app-el-videoslist grid-inner">
  	<div class="app-el-videoslist__title">
      <ERichText ref="title" tag="h2" weight="regular" :content="contents.title" />
    </div>

  	<div class="app-el-videoslist__list">
  		<EVideosItem
        v-for="(item, index) in items"
        :key="index"
        :index="index"
        :content="item"
  			/>
  	</div>
  </div>

</template>

<script>
// import { gsap } from 'gsap'


export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
		items() {
      const items = this.contents.items

      return items
    },
  },
  mounted() {
  	console.log('props / contents', this.contents)
  },
  beforeDestroy() {
  },
  methods: {

  }
}

</script>

<style lang="scss">

.app-el-videoslist{
	margin: desktop-vw(150px) 0;
	grid-column: 2 / span 10;

	@include mobile{
		margin: 0 0 mobile-vw(40px);
	}

	&__title{
    grid-column: 2 / span 6;
    grid-row: 1;
    display: flex;
    flex-direction: column;
		margin: 0 0 desktop-vw(50px);
	  width: 90%;

    @include mobile {
      grid-column: 1 / span 12;
			margin: 0 0 mobile-vw(40px);
      width: 100%;
    }

		.H2.medium{
			font-size: desktop-vw(100px);
			line-height: desktop-vw(90px);

			@include font-ITCFranklinGothicLT-BkCp();

			@include mobile{
				font-size: mobile-vw(60px);
				line-height: mobile-vw(60px);
			}

		}
	}

	&__list{
	    grid-column: 2 / span 10;
	    
	    @include mobile {
	      grid-column: 1 / span 12;
	    }
	}
	
}

</style>