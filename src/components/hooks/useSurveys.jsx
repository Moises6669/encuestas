import { useState, useEffect } from 'react'
import axios from 'axios'

const useSurveys = (url, optional)=> {
    const [surveys, setSurveys] = useState();
    const [totalPages, setTotalPages] = useState(0);
    const surveysPerPage = 8;

    const getSurvey = async () => {
        await axios.get(url)
            .then(resp => {
                optional ? setSurveys(resp.data.Poll.questions) : setSurveys(resp)
                setTotalPages(Math.ceil(resp.data.userDB.length / surveysPerPage))
            }).catch(error => console.log(error))
    }

    useEffect(() => {
        getSurvey();
    }, [url, optional])

    const extra = () => {
        getSurvey();
    }

    return [surveys, extra, totalPages, surveysPerPage]
}

export default useSurveys