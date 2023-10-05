import React, {useEffect, useState} from "react";
import {IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonList, IonSearchbar} from "@ionic/react";
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
    const [showStationList,setShowStationList]=useState<T[]>([]);
    const [sortedStationList,setSortedStationList]=useState<T[]>([]);
    useEffect(() => {
        if(query.length==0){
            setSortedStationList((prev)=>itemList);
        }else{
            setSortedStationList(()=>sortList(itemList,query));
        }

    }, [query,itemList]);
    useEffect(() => {
        setShowStationList(()=>sortedStationList.slice(0,100));
    }, [sortedStationList]);

    const generateItems = () => {
        console.log("generateItems");
        setShowStationList((prev)=>{
            return sortedStationList.slice(0,prev.length+100);
        })
    };
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
                        showStationList.map(station=>
                            <IonItem key={station.id}>

                                {renderRow(station,(item)=>{
                                if(onClicked){
                                    onClicked(item)
                                }
                            })}
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