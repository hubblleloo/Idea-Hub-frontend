import React, {useState, useEffect} from 'react';
import SinglePublicationCard from "../../utilities/SinglePublicationCard";
import PublicationDialog from "./PublicationDialog";
import PublicationService from "../../../services/dashboard/Publication.Service";
import AuthService from '../../../services/auth/Auth.Service';
import AlertDialog from "../../utilities/AlertDialog";

function Home() {

    const [isPublicationDialogOpen, setIsPublicationDialogOpen] = useState(false);
    const [clickedPublication, setClickedPublication] = useState({
        uuid:"",
        title:"",
        author:"",
        publicationHouse:"",
        abstract:"",
        detail:"",
        approved:false,
        fileId:""
        }
    );
    const [datas, setDatas] = useState([{

    }]);

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    //loading data
    useEffect(()=>{
        PublicationService.getApprovedPublications()
            .then((response) => {
                setDatas(response)
            })
    },[])

    useEffect(()=>{
        AuthService.getCurrentUser();
    },[])

    useEffect(()=>{
        if(datas ===null){
            setIsAlertDialogOpen(true)
        }
    },[datas])

    function publicationClickHandler(uuid){
        setIsPublicationDialogOpen(true)

        //getting the fake object
        //the filter object returns a list
        //the list should contain only one object with given uuid
        let data = datas.filter((data)=>data.uuid === uuid)[0]
        setClickedPublication({
            title: data.title,
            publicationHouse: data.publicationHouse,
            uuid:uuid,
            author:data.authorId,
            abstract: data.abst,
            detail:data.detail,
            approved: data.approved,
            fileId: data.fileId
        })
        console.log(clickedPublication.title)
        // setClickedPublication(fake)
        console.log(uuid)
    }
    return (
        <div style={{
            display:'grid',
            marginTop:'64px',
            marginLeft:'32px',
            alignItems:'center',
            gridTemplateColumns: '1fr 1fr 1fr 1fr'

        }}>
            {
                datas ? datas.map((data)=>
                    <div key={data.uuid} onClick={()=>publicationClickHandler(data.uuid)}>
                        <SinglePublicationCard data={data} />
                    </div>
                ) : <AlertDialog topic={"ALERT"} alertMessage={"No publication found"} isAlertDialogOpen={isAlertDialogOpen} setIsAlertDialogOpen={setIsAlertDialogOpen}/>
            }

            <PublicationDialog isPublicationDialogOpen={isPublicationDialogOpen}
                               setIsPublicationDialogOpen={setIsPublicationDialogOpen}
                                clickedPublication={clickedPublication}
            />
        </div>

    );
}

export default Home;
