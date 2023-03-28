import { configure } from 'mobx';

setTimeout(() => {
    configure({
        enforceActions: 'never',
        reactionScheduler: f => setTimeout(f)
    });
}, 1);
