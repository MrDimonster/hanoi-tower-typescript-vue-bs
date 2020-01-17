export class Solver{
    public stack1: Array<number> = [];
    public stack2: Array<number> = [];
    public stack3: Array<number> = [];
    disksCount: number = 3;
    recursive: boolean = false;
    from?: Array<number>;
    to?: Array<number>;
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
        this.from = undefined;
        this.to = undefined;
        this.lastPusher = -1;
        this.solved = false;
        this.pauseMs = pauseMs;
        for(let i = 1; i <= dk; i++)
            this.stack1.push(i);
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

        this.from = [];
        this.to = [];
        if(s1 < 99 && (s1 < s2 || s1 < s3) && this.lastPusher != 1)
            this.from = this.stack1;
        else if(s2 < 99 && (s2 < s1 || s2 < s3) && this.lastPusher != 2)
            this.from = this.stack2;
        else if(s3 < 99 && (s3 < s1 || s3 < s2) && this.lastPusher !=3)
            this.from = this.stack3;
        
        let popValue = this.from[0];
        let s1CanPush = (popValue < s1) && this.from != this.stack1;
        let s2CanPush = (popValue < s2) && this.from != this.stack2;
        let s3CanPush = (popValue < s3) && this.from != this.stack3;

        let pushCount = (s1CanPush ? 1: 0) + (s2CanPush ? 1 : 0) + (s3CanPush ? 1 : 0);
        if(pushCount === 2){
            ///f->r->t (2n disks), f->t->r (2n+1 disks)
            let curPos = 1;
            if(this.from == this.stack2) curPos = 2;
            else if(this.from == this.stack3) curPos = 3;

            if(curPos === 1) this.to = this.stack2;
            else if(curPos === 2) this.to = this.stack3;
            else if(curPos === 3) this.to = this.stack1;
        }
        else{
            this.to = this.stack3;
            if(s2CanPush) this.to = this.stack2;
            else if(s1CanPush) this.to = this.stack1;
        }

        this.from.shift();
        this.to.unshift(popValue);
        this.movesCount++;
        if(this.stack2.length == this.disksCount || this.stack3.length == this.disksCount){
            this.solved = true;
            return true;
        }
        else{
            this.lastPusher = 1;
            if(this.to === this.stack2) this.lastPusher = 2;
            else if(this.to === this.stack3) this.lastPusher = 3;
        }
        return false;
    }

    pause(ms: number): Promise<any>{
        return new Promise(x => setTimeout(x,ms));
    }

}