function getEvents(calendar){
    let events = null;
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        events = JSON.parse(xhr.responseText);
        for (let event of events) {
            let formattedEvent = {
                title: event.title,
                start: event.startDate,
                end: event.endDate,
                description: event.description,
                formattedStartDate: event.formattedStartDate,
                formattedEndDate: event.formattedEndDate,
            }
            if (event.url) {
                formattedEvent.url = event.url
            }
            calendar.addEvent(formattedEvent)
        }
    }
    xhr.open("POST", '/calendar/events');
    xhr.send();
}

function openEvent(info){
        info.jsEvent.preventDefault(); // don't let the browser navigate
        document.getElementById("eventTitle").innerHTML = info.event._def.title;
        document.getElementById("startTime").innerHTML = "<b>Starttidspunkt: </b>" + info.event.extendedProps.formattedStartDate;
        document.getElementById("endTime").innerHTML = "<b>Sluttidspunkt: </b>" + info.event.extendedProps.formattedEndDate;
        document.getElementById("eventDescription").innerHTML = info.event.extendedProps.description;
        if (info.event._def.url) {
            document.getElementById("eventURL").innerHTML = info.event._def.url;
            document.getElementById("eventURL").href = info.event._def.url;
        } else {
            document.getElementById("eventURL").innerHTML = null;
            document.getElementById("eventURL").href = null;
        }
        openEventModal()
}

function openEventModal() {
    $(document).ready(function () {
        $('#eventModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $("#eventModal").modal('show');
    });
}

function createEvent(info, admin){
    let isAdmin = admin === 'true'

    if (!isAdmin) {
        return;
    }

    console.log(isAdmin)

    $(document).ready(function () {
        $('#createEventModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $("#createEventModal").modal('show');

        document.getElementById('startDate').value = info.dateStr

        $('#createEventModal').on('hidden.bs.modal', function (e) {
            document.getElementById('eventForm').reset();
            greyOutTime()
        })
    });
}