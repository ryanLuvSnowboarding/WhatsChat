package service

import (
	"around/backend"
	"around/constants"
	"around/model"
	"mime/multipart"
	"reflect"

	"github.com/olivere/elastic/v7"
)

func SearchPostsByUser(user string) ([]model.Post, error) {
    query := elastic.NewTermQuery("user", user)
    searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
    if err != nil {
        return nil, err
    }
    return getPostFromSearchResult(searchResult), nil
}

func SearchPostsByKeywords(keywords string) ([]model.Post, error) {
    query := elastic.NewMatchQuery("message", keywords)
    query.Operator("AND")
    if keywords == "" {
        query.ZeroTermsQuery("all")
    }
    searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
    if err != nil {
        return nil, err
    }
    return getPostFromSearchResult(searchResult), nil
}

func getPostFromSearchResult(searchResult *elastic.SearchResult) []model.Post {
    var ptype model.Post
    var posts []model.Post

    for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
        p := item.(model.Post)
        posts = append(posts, p)
    }
    return posts
}

func SavePost(post *model.Post, file multipart.File) error {
    //1. save to GCS
    medialink, err := backend.GCSBackend.SaveToGCS(file, post.Id)
    if err != nil {
        return err
    }
    //1.5. get the URL from GCS, set post.URL
    post.Url = medialink
    //2. save to ES
    return backend.ESBackend.SaveToES(post, constants.POST_INDEX, post.Id)
    // A potential problem is violating 原子性. It is possible the image/video is saved to GCS successfully, but it fail to be saved in ES.
    
    //err = backend.ESBackend.SaveToES(post)
    //if err != nil {
    //  //1. try 3 times
    //  //2. delete file from GCS //rollback
    //  //3. program: check all files in bucket, check whether the url saved in ES, if not, delete file
    //}
}

func DeletePost(id string, user string) error {
    query := elastic.NewBoolQuery()
    query.Must(elastic.NewTermQuery("id", id))
    query.Must(elastic.NewTermQuery("user", user))

    return backend.ESBackend.DeleteFromES(query, constants.POST_INDEX)
}
