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
    //queryを条件としてソートされたリスト
    sortList:(list:T[],query:string)=>T[],
    //要素がクリックされた時に行われるアクション
    onClicked?:((clicked:T)=>void),
    getSelected?:(a:()=>T[])=>void
}

export function SujiroList<T　extends Tsub>({itemList,renderRow,sortList,onClicked,getSelected}:SujiroListProps<T>):JSX.Element{
    const [query, setQuery] = useState<string>('');
    const [showList,setShowList]=useState<T[]>([]);
    const [sortedList,setSortedList]=useState<T[]>([]);

    const [selectedList,setSelectedList]=useState<boolean[]>([]);
    const [focus,setFocus]=useState<boolean[]>([]);
    const [selectStart,setSelectStart]=useState<number|undefined>(undefined);
    const AAA:()=>T[]=()=>{
        return selectedList.map((v,i)=>{if(v){return showList[i];}else{return undefined;}}).filter(item=>item!==undefined) as T[];
    }
    if(getSelected!==undefined)getSelected(AAA);


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
    useEffect(() => {
        if(query.length==0){
            setSortedList(()=>itemList);
        }else{
            setSortedList(()=>sortList(itemList,query));
        }
    }, [query,itemList]);
    useEffect(() => {
        setShowList(()=>sortedList.slice(0,100));
    }, [sortedList]);
    useEffect(() => {
        setSelectedList(showList.map(()=>false));
    }, [showList]);

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
                }
            }}
    },undefined,[selectedList]);

    const generateItems = () => {
        console.log("generateItems");
        setShowList((prev)=>{
            return sortedList.slice(0,prev.length+100);
        })
        setSelectedList(old=>{
            const next=[...old];
            for(let i=0;i<showList.length-old.length;i++){
                next.push(false);
            }
            return next;
        })
    };
    const clicked=(item:T)=>{
        if(onClicked){
            onClicked(item)
        }
    }
    return (
            <div>
                <IonSearchbar value={query} onIonChange={e =>{
                    console.log(e.detail.value);
                    setQuery(()=>e.detail.value??"");
                }}
                >
                </IonSearchbar>
                <IonList>
                    {
                        showList.map((item,i)=> {
                            let style = {};
                            if(focus[i]){
                                style={border:"1px black solid"};
                            }
                            return (
                            <IonItem key={item.id} style={style}>
                                <IonCheckbox style={{width: "40px"}} checked={selectedList[i]}
                                             onIonChange={(e) => {e.preventDefault();setSelect(i, e.detail.checked)}}/>
                                {renderRow(item, clicked)}
                            </IonItem>
                            )

                        })
                    }
                </IonList>
                <IonInfiniteScroll
                    onIonInfinite={(ev) => {
                        generateItems();
                        setTimeout(() => ev.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
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

// 基本レイアウトコンポーネント
export const SujiroListTest : React.FC = ():JSX.Element => {
    const showList:A[]=[{id:0,value:"a"},{id:1,value:"b"},{id:2,value:"c"},{id:3,value:"d"},{id:4,value:"e"}];
    let aaa:()=>A[];
    const getSelected= (a:()=>A[])=>{
        aaa=a;
    }

    return (
        <>
            <IonButton onClick={()=>{console.log(aaa())}}>test</IonButton>
                <SujiroList
                    itemList={showList}
                    renderRow={(item:A) => (
                        <ChildComponent key={showList.indexOf(item)} item={item} />
                    )}
                    sortList={(list,query)=>{
                        return list.filter(item=>item.value.includes(query));
                    }}
                    getSelected={getSelected}
                />
        </>
        )
}