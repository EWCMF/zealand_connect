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
                allDay: event.allday,
                formattedStartDate: event.formattedStartDate,
                formattedEndDate: event.formattedEndDate,
            }
            if (event.url) {
                formattedEvent.url = event.url;
            }
            if (event.location) {
                formattedEvent.location = event.location;
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
        document.getElementById("eventLocation").hidden = false;
        document.getElementById('eventLocationLabel').hidden = false;
        document.getElementById("eventLocation").innerHTML = null;
        if (info.event.extendedProps.location) {
            document.getElementById("eventLocation").innerHTML = info.event.extendedProps.location;
        } else {
            document.getElementById("eventLocation").hidden = true;
            document.getElementById('eventLocationLabel').hidden = true;
        }
        document.getElementById('modalEditButton').onclick = null;
        document.getElementById('modalEditButton').onclick = function () {
            passInfoToEdit(info);
        }
        openEventModal()
}

function passInfoToEdit(info) {
    document.getElementById('modal-content').innerHTML = document.getElementById('eventModalCreate').innerHTML;

    let startDate = new Date(info.event.start);

    console.log(info);
    
    let formattedStartDate = startDate.getFullYear() + "-" + zeroPadDate(startDate.getMonth() + 1) 
    + (startDate.getMonth() + 1) + "-" + zeroPadDate(startDate.getDate()) + startDate.getDate();

    let endDate = new Date(info.event.end);

    let formattedEndDate = endDate.getFullYear() + "-" + zeroPadDate(endDate.getMonth() + 1) 
    + (endDate.getMonth() + 1) + "-" + zeroPadDate(endDate.getDate()) + endDate.getDate();

    document.getElementById('startDate').value = formattedStartDate;
    document.getElementById('endDate').value = formattedEndDate;

    let startTime = zeroPadDate(startDate.getUTCHours()) + startDate.getUTCHours() + ':' + zeroPadDate(startDate.getMinutes()) + startDate.getMinutes();
    let endTime = zeroPadDate(endDate.getUTCHours()) + endDate.getUTCHours() + ':' + zeroPadDate(endDate.getMinutes()) + endDate.getMinutes();

    console.log(startTime);

    document.getElementById('formStartTime').value = startTime;
    document.getElementById('formEndTime').value = endTime;

    if (info.event.allDay) {
        document.getElementById('allDay').checked = true;
        greyOutTime();
    }

    document.getElementById('formTitle').value = info.event.title;

    if (info.event.extendedProps.location) {
        document.getElementById('location').value = info.event.extendedProps.location
    }

    if (info.event.url) {
        document.getElementById('url').value = info.event.url
    }

    document.getElementById('description').value = info.event.extendedProps.description;
}

function zeroPadDate(number) {
    return number > 9 ? '' : '0';
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

    $(document).ready(async function () {

        document.getElementById('modal-content').innerHTML = document.getElementById('eventModalCreate').innerHTML;

        $('#eventModal').modal({
            backdrop: 'static',
            keyboard: false
        });

        $("#eventModal").modal('show');

        document.getElementById('startDate').value = info.dateStr

        $('#eventModal').on('hidden.bs.modal', function (e) {
            document.getElementById('modal-content').innerHTML = document.getElementById('eventModalShow').innerHTML;
        })
    });
}

function greyOutTime() {
    let checked = document.getElementById('allDay').checked;

    if (checked) {
        document.getElementById('formStartTime').value = "";
        document.getElementById('formEndTime').value = "";
        document.getElementById('timeArea').classList.add('disable-form');
    } else {
        document.getElementById('timeArea').classList.remove('disable-form');
    }
}