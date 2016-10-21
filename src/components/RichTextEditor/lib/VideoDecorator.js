import {Entity} from 'draft-js'
import {ENTITY_TYPE} from 'draft-js-utils'
import VideoSpan from '../ui/VideoSpan'

import type {ContentBlock} from 'draft-js'

type EntityRangeCallback = (start: number, end: number) => void;

function findVideoEntities(contentBlock: ContentBlock, callback: EntityRangeCallback) {
    contentBlock.findEntityRanges((charactor) => {
        const entityKey = charactor.getEntity()
        return (
            entityKey != null &&
            Entity.get(entityKey).getType() === ENTITY_TYPE.VIDEO
        )
    }, callback)
}

export default {
    strategy: findVideoEntities,
    component: VideoSpan
}