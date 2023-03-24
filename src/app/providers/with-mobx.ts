import { configure } from 'mobx';

setTimeout(() => {
    configure({
        reactionScheduler: f => {
            setTimeout(f, 1);
        }
    });
}, 1);
