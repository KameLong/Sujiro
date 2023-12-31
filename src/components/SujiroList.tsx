import React, {useEffect, useState} from "react";
import {
    IonButton,
    IonCheckbox,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonList,
    IonSearchbar
} from "@ionic/react";
import {useKey} from "react-use";
interface Tsub{
    id:number
}
interface SujiroListProps<T　extends Tsub>{
    // 表示する子View
    renderRow:(item:T,onClicked:(clicked:T)=>void)=>JSX.Element
    //入力リスト
    itemList:T[],
    //要素がクリックされた時に行われるアクション
    onClicked?:((clicked:T)=>void),
    getSelected?:(a:()=>T[])=>void
}

export function SujiroList<T　extends Tsub>({itemList,renderRow,onClicked,getSelected}:SujiroListProps<T>):JSX.Element{

    const tmpList=itemList.map(()=>false);
    tmpList.push(false);

    const [selectedList,setSelectedList]=useState<boolean[]>(tmpList);

    const [focus,setFocus]=useState<boolean[]>([]);
    const [selectStart,setSelectStart]=useState<number|undefined>(undefined);

    const AAA:()=>T[]=()=>{
        return selectedList.map((v,i)=>{if(v){return itemList[i];}else{return undefined;}}).filter(item=>item!==undefined) as T[];
    }
    if(getSelected!==undefined)getSelected(AAA);

    const listRef = React.createRef<HTMLIonListElement>()


    const setSelect=(index:number,value:boolean)=>{
        setSelectStart(undefined);
        if(value){
            setFocus(selectedList.map((_,i)=>i===index));
        }
        setSelectedList(old=>{
            const next=[...old];
            next[index]=value;
            return next;
        })
    }


    const showFocusItem=(index:number)=>{
        const element=listRef.current?.children[index-1];
        if(element===undefined){
            return;
        }
        element.scrollIntoView({block:"nearest"})


    }

    useKey("ArrowUp",(e)=>{
        e.preventDefault();
        if(e.shiftKey) {
            console.log("ShiftUp");
            const index = focus.findIndex(item => item);
            if(index<=0){
                return;
            }else{
                let a=selectStart;
                if(selectStart===undefined){
                    setSelectStart(index);
                    a=index;
                }
                setSelectedList(old =>
                    old.map((_,i) => (i-a!!)*(i-(index-1))<=0)
                );
                setFocus(selectedList.map((_, i) => i === index - 1));
                showFocusItem(index-1);
            }
        }else {
            console.log("Up");
            setSelectStart(undefined);
            if (selectedList.every(item => !item)) {
                setSelect(0, true);
            } else {
                const index = focus.findIndex(item => item);
                if (index > 0) {
                    setSelectedList(old => {
                        const next = old.map(() => false);
                        next[index - 1] = true;
                        return next;

                    });
                    setFocus(selectedList.map((_, i) => i === index - 1));
                    showFocusItem(index-1);
                }
            }
        }

    },undefined,[selectedList]);
    useKey("ArrowDown",(e)=>{
        if(e.shiftKey) {
            console.log("ShiftDown");

            const index = focus.findIndex(item => item);
            if(index<0||index>=selectedList.length-1){
                return;
            }else{
                let a=selectStart;
                if(selectStart===undefined){
                    setSelectStart(index);
                    a=index;
                }
                setSelectedList(old =>
                    old.map((_,i) => (i-a!!)*(i-(index+1))<=0)
                );
                setFocus(selectedList.map((_, i) => i === index + 1));
                showFocusItem(index+1);
            }

        }else{
            setSelectStart(undefined);
            e.preventDefault();
            console.log("Down");
            if(selectedList.every(item=>!item)){
                setSelect(0,true);
            }else{
                const index=focus.findIndex(item=>item);
                if(index<selectedList.length-1){
                    setSelectedList(old=>{
                        const next=old.map(()=>false);
                        next[index+1]=true;
                        return next;

                    });
                    setFocus(selectedList.map((_,i)=>i===index+1));
                    showFocusItem(index+1);

                }
            }}
    },undefined,[selectedList]);


    const clicked=(item:T)=>{
        if(onClicked){
            onClicked(item)
        }
    }
    let lastStyle = {};
    if(focus[itemList.length]){
        lastStyle={border:"1px black solid"};
    }

    return (
        <div >
            <IonList  ref={listRef} >
                {
                    itemList.map((item,i)=> {
                        let style = {};
                        let ref=null;
                        if(focus[i]){
                            style={border:"1px black solid"};
                            ref=listRef;
                        }

                        return (
                            <IonItem key={item.id} style={style} >
                                <IonCheckbox style={{width: "40px"}} checked={selectedList[i]}
                                             onIonChange={(e) => {e.preventDefault();setSelect(i, e.detail.checked)}}/>
                                {renderRow(item, clicked)}
                            </IonItem>
                        )

                    })
                }
                <IonItem key={-1} style={lastStyle} >
                    <IonCheckbox style={{width: "40px"}} checked={selectedList[itemList.length]}
                                 onIonChange={(e) => {e.preventDefault();setSelect(itemList.length, e.detail.checked)}}/>

                </IonItem>

            </IonList>
        </div>
    )
}

interface ChildProps{
    item:A
}
const ChildComponent: React.FC<ChildProps> = (props):JSX.Element => {
    return (
        <div style={{marginLeft:"20px"}}>{props.item.value}</div>
    )
}

interface A{
    id:number,
    value:string
}

