export class Solver{
    public stack1: Array<number> = [];
    public stack2: Array<number> = [];
    public stack3: Array<number> = [];
    disksCount: number = 3;
    recursive: boolean = false;
    lastPusher?: number;
    public movesCount: number = 0;
    solved: boolean = false;
    pauseMs = 500;
    constructor(){
    }
    init(dk: number, pauseMs: number): void{
        this.disksCount = dk;
        this.stack1 = [];
        this.stack2 = [];
        this.stack3 = [];
        this.movesCount = 0;
        this.lastPusher = -1;
        this.solved = false;
        this.pauseMs = pauseMs;
        for(let i = 1; i <= dk; i++) this.stack1.push(i);
    }

    async run(): Promise<void>{
        while(!this.solved){
            await this.pause(this.pauseMs);
            this.step();
        }
    }

    step(): boolean{
        let s1 = this.stack1.length > 0 ? this.stack1[0]: 99;
        let s2 = this.stack2.length > 0 ? this.stack2[0]: 99;
        let s3 = this.stack3.length > 0 ? this.stack3[0]: 99;
        let from = [];
        let to = [];
        let f = -1; 
        let t =-1;
        if(s1 < 99 && (s1 < s2 || s1 < s3) && this.lastPusher != 1) f = 1;
        else if(s2 < 99 && (s2 < s1 || s2 < s3) && this.lastPusher != 2) f = 2;
        else if(s3 < 99 && (s3 < s1 || s3 < s2) && this.lastPusher !=3) f = 3;
        
        from = this.stack1;
        if(f == 2) from = this.stack2;
        else if(f == 3) from = this.stack3;
        
        let popValue = from[0];
        let s1CanPush = (popValue < s1) && f != 1;
        let s2CanPush = (popValue < s2) && f != 2;
        let s3CanPush = (popValue < s3) && f != 3;

        let pushCount = (s1CanPush ? 1: 0) + (s2CanPush ? 1 : 0) + (s3CanPush ? 1 : 0);
        if(pushCount === 2){
            ///f->r->t (2n disks), f->t->r (2n+1 disks)
            let curPos = 1;
            if(f == 2) curPos = 2;
            else if(f == 3) curPos = 3;

            if(curPos === 1) t = 2;
            else if(curPos === 2) t = 3;
            else if(curPos === 3) t = 1;
        }
        else{
            t = 3;
            if(s2CanPush) t = 2;
            else if(s1CanPush) t = 1;
        }

        to = this.stack1;
        if(t == 2) to = this.stack2;
        else if(t == 3) to = this.stack3;

        from.shift();
        to.unshift(popValue);

        this.movesCount++;
        if(this.stack2.length == this.disksCount || this.stack3.length == this.disksCount){
            this.solved = true;
            return true;
        }
        else{
            this.lastPusher = t;
        }
        return false;
    }

    pause(ms: number): Promise<any>{
        return new Promise(x => setTimeout(x,ms));
    }

}