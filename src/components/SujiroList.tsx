import React, {useEffect, useState} from "react";
import {IonCheckbox, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonSearchbar} from "@ionic/react";
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
    onClicked?:((clicked:T)=>void)
}

export function SujiroList<T　extends Tsub>({itemList,renderRow,sortList,onClicked}:SujiroListProps<T>):JSX.Element{
    const [query, setQuery] = useState<string>('');
    const [showList,setShowList]=useState<T[]>([]);
    const [sortedList,setSortedList]=useState<T[]>([]);
    const [selectedList,setSelectedList]=useState<boolean[]>([]);
    console.log(selectedList);
    const setSelect=(index:number,value:boolean)=>{
        console.log(index,value);
        setSelectedList(old=>{
            const next=[...old];
            next[index]=value;
            console.log(next);
            return next;
        })
    }
    useEffect(() => {
        if(query.length==0){
            setSortedList((prev)=>itemList);
        }else{
            setSortedList(()=>sortList(itemList,query));
        }
    }, [query,itemList]);
    useEffect(() => {
        setShowList(()=>sortedList.slice(0,100));
        setSelectedList(showList.map(item=>false));

    }, [sortedList]);
    useKey("ArrowUp",(e)=>{
        console.log(selectedList);
        e.preventDefault();
        console.log("up");
        if(selectedList.every(item=>!item)){
            setSelect(0,true);
        }else{

            const index=selectedList.findIndex(item=>item);
            console.log(index);
            if(index>0){
                setSelectedList(old=>{
                    const next=old.map(item=>false);
                    next[index-1]=true;
                    return next;

                });
            }
        }

    },undefined,[selectedList]);
    useKey("ArrowDown",(e)=>{
        console.log(selectedList);
        e.preventDefault();
        console.log("down");
        if(selectedList.every(item=>!item)){
            setSelect(0,true);
        }else{
            const index=selectedList.findIndex(item=>item);
            console.log(index);
            if(index>=0){
                setSelectedList(old=>{
                    const next=old.map(item=>false);
                    next[index+1]=true;
                    return next;

                });
            }
        }
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
                    setQuery((prev)=>e.detail.value??"");
                }}
                >
                </IonSearchbar>
                <IonList>
                    {
                        showList.map((item,i)=>
                            <IonItem key={item.id}>
                                <IonCheckbox style={{width:"40px"}} checked={selectedList[i]}
                                             onIonChange={(e)=>setSelect(i,e.detail.checked)}/>
                                {renderRow(item,clicked)}
                            </IonItem>

                        )
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
        return (
                <SujiroList
                    itemList={showList}
                    renderRow={(item:A) => (
                        <ChildComponent key={showList.indexOf(item)} item={item} />
                    )}
                    sortList={(list,query)=>{
                        return list.filter(item=>item.value.includes(query));
                    }}
                />
        )
}