import { v4 as uuidv4 } from 'uuid';
// import { } from '../assets/pdf/자료예제들/폴더1/'
// import PDFs from '../assets/pdf/root/pdf'


/**
 * 소속 카테고리
  1	부서	1
  2	그룹	2
 */
class TeamCtgrData {
    constructor({ id, nm, order }) {
        this.team_ctgr_id = id;
        this.team_nm = nm;
        this.team_order = order;
    }

    static make() {
        return [
            new TeamCtgrData({ id: 1, nm: "부서", order: 1 }),
            new TeamCtgrData({ id: 2, nm: "그룹", order: 2 }),
        ]
    }
}

/**
 * 
 */
class TeamData {
    /**
     * 
     * @param {*} teamId 팀 아이디
     * @param {*} teamUpId 상위 팀 아이디
     * @param {*} teamCtgrId 팀 카테고리
     * @param {*} teamDirNm 팀 이름
     */
    constructor(teamId, teamUpId, teamCtgrId, teamDirNm) {
        this.team_id = teamId
        this.team_up_id = teamUpId
        this.team_ctgr_id = teamCtgrId
        this.team_dir_nm = teamDirNm
    }

    static make() {
        return [
            new TeamData(1, 0, 1, '부서1'),
            new TeamData(2, 0, 1, '부서2'),
            new TeamData(3, 2, 2, '그룹1'),
            new TeamData(4, 2, 2, '그룹2'),
        ]
    }
    /**
     * 
     * @param { Array } list 
     */
    getLowerInList(list) {
        return list.filter(it => it.team_up_id = this.team_id)
    }
}

/**
 * 자료(파일) 카테고리 데이터
 * 
    1	MSDS 원본	 1
    2	부착물1	     2
    3	부착물2	     3
 *
 */
class FileCtgrData {
    constructor({ id, nm, order }) {
        this.file_ctgr_id = id;
        this.file_ctgr_nm = nm;
        this.file_ctgr_order = order;
    }
    static make() {
        return [
            new FileCtgrData({
                id: 1, nm: "원본", order: 1,
            }),
            new FileCtgrData({
                id: 2, nm: "부착물1", order: 2,
            }),
            new FileCtgrData({
                id: 3, nm: "부착물2", order: 3,
            })
        ]
    }
}

/**
 * 자료(파일) 데이터
 */
class FileData {
    constructor({ fileId = uuidv4().replace(/-/gi, ''), teamId, fileCtgrId, fileNm, filePath }) {
        this.file_id = fileId
        this.team_id = teamId
        this.file_ctgr_id = fileCtgrId
        this.file_nm = fileNm
        this.file_path = filePath
    }

    static #store = null
    static rootToMake(team_id){
        if (this.#store){
            return this.#store.filter(item=>item.team_id == team_id);
        }
        this.#store = []
        const pdfs = importAll(require.context(process.env.REACT_APP_PDF, false, /\.(pdf)$/));
        Object.keys(pdfs).forEach(it=>{
            let names = it.split("_")
            const team = names[0]
            const fileCtgr = names[1]
            const name = it.replace('.pdf',"")
            this.#store.push(new FileData({  
                teamId: parseInt(team), 
                fileCtgrId: parseInt(fileCtgr),
                fileNm: name,
                filePath: encodeURIComponent(pdfs[it])
            }))
        })
        return this.#store.filter(item=>item.team_id == team_id);
    }
}

/**
 * Thumbnail data
 */
class FileThumbnail{

    constructor({ fileThumbnailId = uuidv4().replace(/-/gi, ''), teamId, fileId, fileNm, filePath }) {
        this.fileThumbnailId = fileThumbnailId
        this.team_id = teamId
        this.file_id = fileId
        this.file_nm = fileNm
        this.file_path = filePath
    }

    static #store = null
    static rootToMake(team_id){
        if (this.#store){
            return this.#store.filter(item=>item.team_id == team_id);
        }
        const imgs = importAll(require.context(process.env.REACT_APP_THUMBNAIL, false, /\.(png|jpe?g|svg)$/));
        this.#store = []
        Object.keys(imgs).forEach(it=>{
            let names = it.split("_")
            const team = names[0]
            const fileCtgr = names[1]
            const name = it.replace(/\.(png|jpe?g|svg)$/,"")
            this.#store.push(new FileThumbnail({  
                teamId: parseInt(team), 
                fileId: parseInt(fileCtgr),
                fileNm: name,
                filePath: encodeURIComponent(imgs[it])
            }))
        })
        return this.#store.filter(item=>item.team_id == team_id);
    }

}


function importAll(r) {
    let images = {};
    r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
    return images
}


export {
    TeamCtgrData,
    TeamData,
    FileCtgrData,
    FileData,
    FileThumbnail
}