import {Entity} from 'draft-js'
import Audio from '../ui/Audio'

import type {ContentBlock} from 'draft-js'

type EntityRangeCallback = (start: number, end: number) => void;

function findAudioEntities(contentBlock: ContentBlock, callback: EntityRangeCallback) {
    contentBlock.findEntityRanges((charactor) => {
        const entityKey = charactor.getEntity()
        return (
            entityKey != null &&
            Entity.get(entityKey).getType() === 'AUDIO'
        )
    }, callback)
}

export default {
    strategy: findAudioEntities,
    component: Audio
}