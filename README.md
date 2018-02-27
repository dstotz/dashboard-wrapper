# Springboard Retail Dashboard

This program cycles between multiple dashboards to be displayed on a 4k or 1080p TV

## Add new dashboards
You can add a new dashboard in the `/public/js/config.js` file. Specify `show_on_main: true` if you want the dashboard to be displayed on the default dashboard.

## Format
```
dashboardDetails.push({
  id: 'UniqueDashboardId',
  group: 'support',
  name: 'The dashboard name that is displayed on screen',
  url: 'https://dashboardurl.com',
  theme: 'dark',
  show_on_main: true
});
```

## Groups
You can create a new dashboard group by just creating an endpoint in `app.rb` to show `erb :index` and then you can use that group on any of the dashboards you add in `config.js`

Once a group is set up, you can view those dashboards individually from the web_address/group_name

## Controls
While cursor focus is on the top bar with the dashboard names (as it is by default), you can use a keyboard to control the dashboard.
Left = previous
Right = next
Down = pause
Up = refresh page

You can use free apps like unified remote to interact with the dashboard from your phone by setting up the program on your client machine that is running the dashboard.

## Launching on Heroku
1. Create a new free Heroku app
2. Edit the `config.js` file to load in your dashboards
3. Upload the code to Heroku
4. Access your dashboards from the projects address

## Testing
Requires Ruby 2.1 or newer
Modify your `config.js` file to add in your dashboards
Run `bundle install` in the directory to install dependencies
Run `ruby app.rb`
View your dashboard in a web browser at `localhost:4567`
