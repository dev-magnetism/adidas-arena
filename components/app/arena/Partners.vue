<template>
  <div class="app-arena-partners grid">
    <div class="app-arena-partners__content">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-arena-partners__title"
        :content="contents.title"
        tag="p"
      />
      <TP2
        class="app-arena-partners__principal-paragraph partners-apparition"
        weight="bold"
      >
        {{ contents.subtitle }}
      </TP2>
      <TP2
        weight="medium"
        class="app-arena-partners__secondary-paragraph partners-apparition"
      >
        {{ contents.paragraph }}
      </TP2>
      <AtomsCTA :href="contents.ctaLink" class="partners-apparition">
        {{ contents.ctaTitle }}
      </AtomsCTA>
    </div>
    <EGridLogos
      :cols="!$viewport.isMobile ? 6 : 4"
      :rows="!$viewport.isMobile ? 7 : 8"
      :logos="contents.list"
      class="app-arena-partners__grid-logos"
    />
    <EPartnersTotal :total="contents.list.length" :text="contents.totalText" />
  </div>
</template>

<script>
import { gsap } from 'gsap'

export default {
  props: {
    contents: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    if (this.$viewport.isMobile) return

    const els = this.$el.querySelectorAll('.partners-apparition')

    els.forEach((el, index) => {
      const scrollTrigger = {
        trigger: el,
        start: 'top+=75px bottom',
        end: 'top+=75px center',
        toggleActions: 'play none none none',
      }

      gsap.fromTo(
        el,
        {
          y: -40,
        },
        {
          y: 0,
          duration: 1.25,
          ease: 'expo.out',
          delay: 0.3,
          scrollTrigger,
        }
      )

      gsap.fromTo(
        el,
        {
          opacity: 0,
        },
        {
          opacity: index === els.length - 1 ? 1 : 0.8,
          duration: 1.45,
          ease: 'expo.out',
          delay: 0.3,
          scrollTrigger,
        }
      )
    })
  },
}
</script>

<style lang="scss">
.app-arena-partners {
  position: relative;
  margin-bottom: desktop-vw(250px);
  margin-top: desktop-vw(130px);

  @include mobile {
    margin-top: mobile-vw(70px);
  }

  &__grid-logos.app-element-grid-logos {
    grid-column: 7 / span 6;
    position: absolute;
    top: desktop-vw(180px);
    left: 5%;
    width: 95%;

    @include mobile {
      grid-row: 2;
      grid-column: 1 / span 6;
      left: 0;
      position: relative;
      top: 0px;
      width: 100%;
      margin-top: mobile-vw(80px);
    }
  }

  &__content {
    grid-column: 2 / span 7;

    @include mobile {
      grid-row: 1;
      grid-column: 1 / span 6;
    }

    .app-atoms-cta {
      .P2 {
        @include font-ITCFranklinGothicLT-BkCp();
        font-size: desktop-vw(24px);
        line-height: desktop-vw(32px);
        letter-spacing: 0.04em;

        @include mobile {
          font-size: mobile-vw(24px);
          line-height: mobile-vw(32px);
        }
      }
    }
  }

  &__title {
    margin-bottom: desktop-vw(25px);

    @include mobile {
      margin-bottom: mobile-vw(25px);
    }
  }

  &__principal-paragraph.P2 {
    margin-bottom: desktop-vw(25px);
    width: 50%;
    text-transform: uppercase;
    opacity: 0.8;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(25px);
    }
  }

  &__secondary-paragraph.P2 {
    margin-bottom: desktop-vw(50px);
    width: 52.5%;
    opacity: 0.8;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(30px);
    }
  }

  .app-atoms-cta {
    width: 52.5%;

    @include mobile {
      width: 100%;
    }

    &__text.P2 {
      @include font-ITCFranklinGothicLT-DmCp();
    }
  }
}
</style>
