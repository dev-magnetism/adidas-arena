<script>
import JSSoup from 'jssoup'

export default {
  props: {
    content: {
      type: String,
      default: '',
      require: true,
    },
    component: {
      type: Object,
      require: false,
      default: () => ({
        name: 'TP2',
        weight: 'medium',
        tagTarget: 'p',
        tag: 'h4',
      }),
    },
  },
  render(h) {
    const soup = new JSSoup(this.content)

    const texts = soup.findAll(this.component.tagTarget)
    const listBullets = soup.findAll('li')

    texts.forEach((text) => {
      text.attrs.class = text.name
      text.name = text.name === ('li' || 'ul') ? text.name : 'p'
    })

    listBullets.forEach((text) => {
      text.attrs.class = 'li'
    })

    return h({
      template:
        '<div class="app-element-rich-text-event">' +
        soup.prettify() +
        '</div>',
    })
  },
}
</script>

<style lang="scss">
.app-element-rich-text-event {
  .h1,
  .h2,
  .h3,
  .h4,
  .h5 {
    margin: desktop-vw(20px) 0px desktop-vw(10px) 0px;
    @include h4();
    @include font-ITCFranklinGothicLT-DmCp();

  }

  .p {
    @include p3();
    @include font-ITCFranklinGothicLT-BkCp();

    margin-bottom: desktop-vw(10px);

    &:last-of-type {
      margin-bottom: desktop-vw(0px);
    }
  }

  a {
    color: var(--c-blue-adidas) !important;
    cursor: pointer;
    text-decoration: underline;
  }

  .li {
    @include p3();
    @include font-ITCFranklinGothicLT-BkCp();
  }
}
</style>
