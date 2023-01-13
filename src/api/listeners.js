import { date } from 'quasar'
import { echo } from 'src/api/echo'
import { user } from 'src/api/auth'
import { notifications, slide, defer } from 'src/api/store'

export const enable = () => {
    notifications.value = []
    console.log('foo')

    echo.private(`App.Models.User.${user.value.id}`)
    .notification(notification => {
        
        /** проверяем режим "не беспокоить" */
        if (defer.value && defer.value < Date.now()) defer.value = null
        if (defer.value && defer.value > Date.now()) return

        /** до отображения уведомления не даём массиву сообщений увеличиваться
         * выше заданного значения */
        if (notifications.value?.length > 999) notifications.value.shift()
        
        slide.value = notifications.value.push({
            title: notification.title ?? 'Уведомление',
            message: notification.message,
            user: notification.user,
            link: notification.link,
            datetime: notification.datetime,
        }) - 1

        

        appWindowApi.show()
    })
}
export const disable = () => {
    echo.leave(`App.Models.User.${user.value.id}`)
}

export const clear = () => {
    notifications.value = []
    slide.value = 0
}

/** отложитель напоманиение на сколько минут */
// export const defer = (n, minutes) => {
//     // window.localStorage.setItem()
//     defers.value.push({
//         id: n.id,
//         event: n.event,
//         until: date.addToDate(Date.now(), {minutes: minutes}),
//     })
//     n.showRemainderButtons = false

//     // console.log(defers.value);
//     // console.log(n);
// }
