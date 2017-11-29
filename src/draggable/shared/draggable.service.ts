import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { DraggableListener } from './draggable-listner.model';

@Injectable()
export class PipDraggableService {
    private _listeners: DraggableListener[];

    public inputEvent(event) {
        if (!_.isUndefined(event.touches)) {
            return event.touches[0];
        }
    
        else if (!_.isUndefined(event.originalEvent) && !_.isUndefined(event.originalEvent.touches)) {
            return event.originalEvent.touches[0];
        }
        return event;
    };

    public broadcast(eventName, obj) {
        let event = { name: eventName };
        _.each(this._listeners, (listner: DraggableListener) => {
            if (listner.eventName === eventName) listner.triggerFunction(event, obj);
        })
    }

    public on(eventName: string, trigger: Function) {
        let id = String(this._listeners.length);
        this._listeners.push({ eventName: eventName, triggerFunction: trigger, id: id });

        return id;
    }

    public off(id: string) {
        //let index = _.
    }
}