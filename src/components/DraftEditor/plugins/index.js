import { compose } from 'draft-extend'
import LinkPlugin from './LinkPlugin'
// import AudioPlugin from './AudioPlugin'
// import VideoPlugin from './VideoPlugin'
// import ImagePlugin from './ImagePlugin'
import MediaPlugin from './MediaPlugin'
import TextPlugin from './TextPlugin'

const plugins = compose(
    LinkPlugin,
    TextPlugin,
    // ImagePlugin,
    // VideoPlugin,
    // AudioPlugin,
    MediaPlugin
)

export default plugins
