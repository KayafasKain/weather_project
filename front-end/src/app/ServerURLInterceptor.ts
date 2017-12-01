import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';

export class ServerURLInterceptor implements Interceptor {
  public interceptBefore(request: InterceptedRequest): InterceptedRequest {
    let AccessToken = localStorage.getItem('AccessToken');
    if(AccessToken) {
      request.options.headers.append('AccessToken', AccessToken);
    }
    return request;
  }

  public interceptAfter(response: InterceptedResponse): InterceptedResponse {
    return response;
  }
}
