package instagram

import (
	"log"
	"math/rand"
	"strings"
	"sync"
	"time"

	"github.com/ahmdrz/goinsta/v2"
	"github.com/websines/ig-server/database"
	"github.com/websines/ig-server/utilities"
)

var wg sync.WaitGroup

type Task struct {
	FetchedSession string
	Proxy          string
}

func Like() {

	var task []Task

	//Fetch Session from DB
	var sess []database.UserSession
	database.DB.Find(&sess)

	var proxy []database.AssignedProxy
	database.DB.Find(&proxy)

	for i := range sess {
		task = append(task, Task{FetchedSession: sess[i].Session})
	}

	for i := range proxy {
		task = append(task, Task{Proxy: proxy[i].ProxyServer})
	}

	//making the Task Channel
	ch := make(chan Task, len(task))

	MAX_WORKERS := 8

	wg.Add(MAX_WORKERS)

	for i := 0; i < MAX_WORKERS; i++ {
		go func() {
			defer wg.Done()
			for t := range ch {
				DoTasks(t)
			}
		}()
	}

	for i := 0; i < len(task); i++ {
		ch <- task[i]
	}

	close(ch)
	wg.Wait()
}

func DoTasks(t Task) {

	session := t.FetchedSession
	proxy := t.Proxy

	insta, err := utilities.ImportFromBase64String(session)
	if proxy != "" {
		insta.SetProxy(proxy, true)
	}

	defer insta.Logout()

	if err != nil {
		log.Fatal("Error: ", err)
	}

	h := insta.NewHashtag("instaengageco")
	for h.Next() {
		for i := range h.Sections {
			for _, i := range h.Sections[i].LayoutContent.Medias {
				if !i.Item.HasLiked {
					i.Item.Like()
				}
			}
		}
	}

}

type CommentOnReq struct {
	FetchedSession string
	Proxy          string
}

func Comment(text string, shortID string) {
	var cr []CommentOnReq

	var sess []database.UserSession
	database.DB.Find(&sess)

	var proxy []database.AssignedProxy
	database.DB.Find(&proxy)

	for i := range sess {
		cr = append(cr, CommentOnReq{FetchedSession: sess[i].Session})
	}
	for i := range proxy {
		cr = append(cr, CommentOnReq{Proxy: proxy[i].ProxyServer})
	}

	//making the Task Channel
	channel := make(chan CommentOnReq, len(cr))

	MAX_WORKERS := 8

	wg.Add(MAX_WORKERS)

	for i := 0; i < MAX_WORKERS; i++ {
		go func() {
			defer wg.Done()
			for crq := range channel {
				MakeComment(crq, text, shortID)
			}
		}()
	}

	for i := 0; i < len(cr); i++ {
		channel <- cr[i]
	}

	close(channel)
	wg.Wait()

}

func MakeComment(cr CommentOnReq, text string, shortID string) {

	session := cr.FetchedSession
	proxy := cr.Proxy

	insta, err := utilities.ImportFromBase64String(session)
	insta.SetProxy(proxy, true)

	defer insta.Logout()

	if err != nil {
		log.Fatal("Error: ", err)
	}

	mediaID, err := goinsta.MediaIDFromShortID(shortID)
	if err != nil {
		panic(err)
	}
	media, err := insta.GetMedia(mediaID)
	if err != nil {
		panic(err)
	}

	spt := strings.Split(text, "; ")

	str := make([]string, 0)

	str = append(str, spt...)

	rand.Seed(time.Now().Unix())
	result := str[rand.Intn(len(str))]

	media.Items[0].Comments.Add(result)
}
