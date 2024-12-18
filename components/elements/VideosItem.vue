<template>

	<div class="app-el-videositem">

	  	<div
	     	class="app-el-videositem__video"
	      	>
	      	<div class="app-el-videositem__video__container">
		    	<div
				    v-if="videoFrame.image && videoFrame.image !== ''"
				    :class="{ invisible: hideVideoOverlay }"
				    class="app-el-videositem__video__overlay"
				    @click="hideVideoOverlay = true"
				  	>
			    	<TH1 tag="p" weight="bold" color="white">PLAY</TH1>

				    <nuxt-picture
						ref="picture"
						provider="directus"
						:src="videoFrame.image"
						format="webp"
						sizes="sm:35vw md:60vw"
				    	/>
				</div>

				<client-only>
			    	<iframe
						:class="{ invisible: videoFrame.image && videoFrame.image !== ''?!hideVideoOverlay:hideVideoOverlay }"
						:src="`https://www.youtube-nocookie.com/embed/${videoFrame.video.id}?modestbranding=1&rel=0&cc_load_policy=1&iv_load_policy=3&hl=fr-fr&fs=0&controls=0&disablekb=1`"
						frameborder="0"
				    	/>
		  		</client-only>
		  	</div>
	    </div>

	    <div class="app-el-videositem__paragraph">
    		<ERichText tag="p" weight="regular" :content="content.video_paragraph" />
    	</div>

	</div>

</template>

<script>
// import { gsap } from 'gsap'


export default {
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      hideVideoOverlay: false,
    }
  },
  computed: {

    videoFrame(){
      // console.log('this.content', this.content)
      const videoItem = { youtube_url: this.content.video_url};
      const itemCover = this.content.video_cover;

      const image = (itemCover && itemCover != null)? itemCover : ''

      // console.log('image', image)

      if (videoItem && videoItem !== 'undefined') {
        videoItem.id = this.getYouTubeVideoId(videoItem.youtube_url)
      }

      return videoItem && videoItem !== 'undefined' ? { video: videoItem, image } : false
      //  return videoItem ? { video: videoItem, image } : false
    },
  },
  mounted() {
  	// console.log('VideosItem / props content', this.content)
  },
  beforeDestroy() {
  },
  methods: {
    getYouTubeVideoId(url) {
      return this.$getYoutubeVideoID(url)
    },

  }
}

</script>

<style lang="scss">

.app-el-videositem{
    display: flex;
    flex-wrap: wrap;
    margin: 0 0 desktop-vw(60px);
    width: 100%;
    align-items: center;
    justify-content: space-between;

    @include mobile{
    	margin: 0 0 mobile-vw(60px);
    }

    &__video{
	    display: inline-block;
	    flex: 0 0 auto;
	    width: 52%;

	    @include mobile{
	    	width: 100%;
	    	margin: 0 0 mobile-vw(32px);
	    }

	    &__container{
    		position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
		    padding: 66.6% 0 0 0;
		    width: 100%;
		    height: 0;
		    overflow: hidden;
	    }

	    iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			&.invisible {
				opacity: 0;
				visibility: hidden;
				pointer-events: none;
				display: none;
			}
	    }

	    .app-el-videositem__video__overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
			transition: opacity 0.4s 0.1s var(--ease-in-out-cubic);

			&.invisible {
				opacity: 0;
				pointer-events: none;
			}

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0.2);
				pointer-events: none;
			}

			.H1 {
				position: absolute;
				z-index: 1;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				pointer-events: none;
				font-size: desktop-vw(135px);
				@include font-ITCFranklinGothicLT-BkCp();

				@include mobile{
					font-size: mobile-vw(135px);
				}
			}

		    img {
				width: 100%;
				height: 100%;
				display: block;
				pointer-events: none;
    			object-fit: cover;
				border: none;

		    }
	    }
    }

    &__paragraph{
    	position: relative;
	    display: inline-block;
	    flex: 0 0 auto;
	    width: 33%;
		@include font-ITCFranklinGothicLT-BkCp();
	    font-size: desktop-vw(17px);
	    line-height: desktop-vw(20px);

	    @include mobile{
	    	width: 100%;
		    font-size: mobile-vw(17px);
		    line-height: mobile-vw(20px);
	    }
    }

    @include desktop{
    	&:nth-child(odd){
    		.app-el-videositem__video{
    			order: 1;
    			transform: rotate(-4.71deg);
    		}
    		.app-el-videositem__paragraph{
    			order: 2;
    		}
    	}
    	&:nth-child(even){
    		.app-el-videositem__video{
    			order: 2;
    			transform: rotate(4.71deg);
    		}
    		.app-el-videositem__paragraph{
    			order: 1;
    		}
    	}
    }

}

</style>
