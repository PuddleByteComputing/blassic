type MessyType = undefined | Promise<undefined | ReadableStreamReadValueResult<any>>;

function createReadableStreamLineReader(response: ReadableStream) {
  let reader: ReadableStreamDefaultReader;
  let cancellationRequest = false;

  return new ReadableStream({
    start: function(controller) {
      const enqueueTrimmed = (text: string) => {
        const trimmed = text.trim();
        if (trimmed.length > 0) {
          controller.enqueue(trimmed);
        }
      }

      reader = response.getReader();
      const decoder = new TextDecoder();
      let data_buf = "";

      reader.read()
        .then(function processResult(result): MessyType {
          if (result.done) {
            if (cancellationRequest) {
              // Immediately exit
              return;
            }
            enqueueTrimmed(data_buf);
            controller.close();
            return;
          }

          const data = decoder.decode(result.value, { stream: true });
          data_buf += data;
          const lines = data_buf.split("\n")
          lines.slice(0, -1).forEach((line) => enqueueTrimmed(line));
          data_buf = lines[lines.length - 1];

          return reader.read().then(processResult);
        });
    },
    cancel: function(reason) {
      console.log("Cancel registered due to ", reason);
      cancellationRequest = true;
      reader.cancel();
    }
  });
};

export default createReadableStreamLineReader;
