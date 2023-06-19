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

    texts.forEach((text) => {
      text.attrs.class = text.name
      text.name = text.name === ('li' || 'ul') ? text.name : 'p'
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
    @include font-adihausDIN-cn-bold();
  }

  .p {
    @include p2();
    @include font-adihausDIN-medium();

    margin-bottom: desktop-vw(10px);

    &:last-of-type {
      margin-bottom: desktop-vw(0px);
    }
  }

  .li {
    @include p2();
    @include font-adihausDIN-medium();
  }
}
</style>
