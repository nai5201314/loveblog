import { Node, mergeAttributes } from '@tiptap/core';

const Video = Node.create({
  name: 'video',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: '360',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'video-wrapper' },
      [
        'video',
        mergeAttributes(HTMLAttributes, {
          controls: 'true',
        }),
        [
          'source',
          { src: HTMLAttributes.src, type: 'video/quicktime' },
        ],
        [
          'source',
          { src: HTMLAttributes.src.replace('.mov', '.mp4'), type: 'video/mp4' },
        ],
        '你的浏览器不支持视频播放。',
      ],
    ];
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default Video;
