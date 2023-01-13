<template>
  <div class="app-home-partners grid">
    <div class="app-home-partners__content">
      <ERichText
        :split="true"
        :scrub="false"
        :overflow="true"
        class="app-home-partners__title"
        :content="contents.title"
      />

      <TP2
        class="app-home-partners__principal-paragraph partners-apparition"
        weight="bold"
      >
        {{ contents.subtitle }}
      </TP2>
      <TP2
        weight="medium"
        class="app-home-partners__secondary-paragraph partners-apparition"
      >
        {{ contents.paragraph }}
      </TP2>
      <AtomsCTA ref="cta" class="partners-apparition"
        >Devenir partenaire</AtomsCTA
      >
    </div>
    <EGridLogos
      :logos="contents.list"
      :cols="!$viewport.isMobile ? 6 : 4"
      :rows="!$viewport.isMobile ? 7 : 8"
      class="app-home-partners__grid-logos"
    />
    <EPartnersTotal :total="contents.list.length" />
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

    els.forEach((el) => {
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
          opacity: 1,
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
.app-home-partners {
  position: relative;
  padding-bottom: desktop-vw(400px);

  @include mobile {
    row-gap: 0px;
    padding-bottom: 0px;
  }

  &__content {
    grid-column: 1 / span 6;

    .app-atoms-cta {
      .P2 {
        @include font-adihausDIN-cn-medium();

        letter-spacing: 0.04em;
      }
    }
  }

  &__title {
    margin-bottom: desktop-vw(25px);

    @include mobile {
      margin-bottom: mobile-vw(30px);

      .H1.wysiwyg-text {
        font-size: mobile-vw(72px);
        line-height: mobile-vw(78px);
      }
    }
  }

  &__principal-paragraph {
    margin-bottom: desktop-vw(25px);
    width: 50%;
    text-transform: uppercase;
    opacity: 0.8;
    will-change: transform;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(25px);
    }
  }

  &__secondary-paragraph {
    margin-bottom: desktop-vw(50px);
    width: 52.5%;
    opacity: 0.8;
    will-change: transform;

    @include mobile {
      width: 100%;
      margin-bottom: mobile-vw(50px);
    }
  }

  .app-atoms-cta {
    width: 52.5%;
    will-change: transform;

    @include mobile {
      width: 100%;
    }
  }

  &__grid-logos {
    grid-column: 6 / span 8;
    position: absolute;
    top: desktop-vw(140px);
    left: 0;

    @include mobile {
      position: relative;
      grid-column: 1 / span 6;
      top: 0;
      margin-top: mobile-vw(75px);
    }
  }
}
</style>
