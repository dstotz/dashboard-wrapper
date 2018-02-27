$LOAD_PATH.unshift './lib'

require 'bundler/setup'
require 'sinatra'
require 'logger'

LOG = Logger.new(STDOUT)

before '*' do
  redirect request.url.sub(%r{^http://}, 'https://') unless request.secure? || request.host == 'localhost'
end

get '/' do
  redirect '/main'
end

get '/all' do
  erb :index
end

get '/main' do
  erb :index
end

get '/support' do
  erb :index
end

get '/sales' do
  erb :index
end

get '/dev' do
  erb :index
end
