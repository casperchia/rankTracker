import {Component} from "angular2/core";

@Component({
    selector: 'graph',
    templateUrl: 'app/components/graph.component.html',
    styleUrls: ['app/components/graph.component.css'],
    directives: [],
    providers: [],
    inputs: ['gameMode']
})

export class GraphComponent{
    gameMode: string;
}